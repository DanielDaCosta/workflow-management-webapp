import uuid
import bs4
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_chroma import Chroma
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

class DocumentLoader:
    def __init__(self, web_path):
        self.web_path = web_path

    def load_documents(self):
        loader = WebBaseLoader(
            web_paths=(self.web_path,),
            bs_kwargs=dict(
                parse_only=bs4.SoupStrainer()
            ),
        )
        return loader.load()

class TextSplitter:
    def __init__(self, chunk_size, chunk_overlap):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_documents(self, docs):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap
        )
        return splitter.split_documents(docs)

class VectorStore:
    def __init__(self, embeddings, collection_name):
        self.collection_name = collection_name
        self.vectorstore = Chroma(
            embedding_function=embeddings,
            collection_name=self.collection_name
        )

    def add_documents(self, documents):
        self.vectorstore.add_documents(documents=documents)

    def get_retriever(self):
        return self.vectorstore.as_retriever()

class PromptTemplateFactory:
    @staticmethod
    def create_prompt_template():
        return PromptTemplate.from_template(
            """
            Use the following pieces of context, extracted from a web page (e.g., article, blog post, Wikipedia entry, etc),
            to answer the question at the end. Use only the information provided in the context to answer the question.

            {context}

            Question: {question}
            Answer:
            """
        )

class RAGChainBuilder:
    def __init__(self, retriever, prompt, llm):
        self.retriever = retriever
        self.prompt = prompt
        self.llm = llm

    def build_chain(self):
        return (
            RunnableParallel({"context": self.retriever | self.format_docs, "question": RunnablePassthrough()})
            | self.prompt
            | self.llm
            | StrOutputParser()
        )

    def format_docs(self, docs):
        return "\n\n".join(doc.page_content for doc in docs)

class RAGPipeline:
    def __init__(self, web_path, model_name="gpt-4o", chunk_size=1000, chunk_overlap=200):
        self.web_path = web_path
        self.model_name = model_name
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        self.document_loader = DocumentLoader(web_path)
        self.text_splitter = TextSplitter(chunk_size, chunk_overlap)
        self.llm = self.initialize_llm()
        self.prompt = PromptTemplateFactory.create_prompt_template()
        self.vectorstore = None
        self.retriever = None
        self.rag_chain = None

        self.load_and_index_documents()
        self.build_rag_chain()

    def initialize_llm(self):
        return ChatOpenAI(model=self.model_name)

    def load_and_index_documents(self):
        docs = self.document_loader.load_documents()
        splits = self.text_splitter.split_documents(docs)
        
        collection_name = f"web_page_{uuid.uuid4()}"
        vector_store = VectorStore(embeddings=OpenAIEmbeddings(), collection_name=collection_name)
        vector_store.add_documents(splits)

        self.vectorstore = vector_store
        self.retriever = self.vectorstore.get_retriever()

    def build_rag_chain(self):
        rag_chain_builder = RAGChainBuilder(self.retriever, self.prompt, self.llm)
        self.rag_chain = rag_chain_builder.build_chain()

    def run(self, question):
        output = self.rag_chain.invoke(question)
        return output