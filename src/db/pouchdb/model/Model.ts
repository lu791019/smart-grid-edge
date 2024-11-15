import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchDBHttp from 'pouchdb-adapter-http';
import PouchDBUpsert from 'pouchdb-upsert';
import * as dotenv from 'dotenv';

PouchDB.plugin(PouchDBHttp);
PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBUpsert);

dotenv.config();

export interface IDocument {
  _id: string;
  _rev?: string;
  [key: string]: any;
}

class PouchDBModel {
  private static instance: PouchDBModel | null = null;
  protected db!: PouchDB.Database<{}>;

  private constructor() {
    const remoteUrl = process.env.REMOTE_DB_URL;
    if (!remoteUrl) {
      throw new Error(
        'REMOTE_DB_URL is not defined in the environment variables',
      );
    }

    console.log('Initializing PouchDB with remote URL:', remoteUrl);
    this.db = new PouchDB(remoteUrl);
    this.createIndex();
  }

  public static getInstance(): PouchDBModel {
    if (!PouchDBModel.instance) {
      PouchDBModel.instance = new PouchDBModel();
    }
    return PouchDBModel.instance;
  }

  private async createIndex(): Promise<void> {
    try {
      await this.db.createIndex({
        index: { fields: ['table'] },
      });
      console.log('Index on "table" field created successfully');
    } catch (error) {
      console.error('Error creating index:', error);
    }
  }

  public async readAllDocs(): Promise<IDocument[]> {
    try {
      const result = await this.db.allDocs({ include_docs: true });
      return result.rows.map((row) => row.doc as IDocument);
    } catch (error) {
      console.error('Error reading all documents:', error);
      throw error;
    }
  }

  public async readDocByTable(table: string): Promise<IDocument[]> {
    try {
      const result = await this.db.find({
        selector: { table: table },
      });
      return result.docs as IDocument[];
    } catch (error) {
      console.error(`Error reading documents from table "${table}":`, error);
      throw error;
    }
  }

  public async readDocByObject(obj: any): Promise<IDocument[]> {
    try {
      const result = await this.db.find({
        selector: obj,
      });
      return result.docs as IDocument[];
    } catch (error) {
      console.error('Error reading documents:', error);
      throw error;
    }
  }

  public async readDocById(id: string): Promise<IDocument> {
    try {
      const doc = await this.db.get(id);
      return doc as IDocument;
    } catch (error) {
      if ((error as PouchDB.Core.Error).status === 404) {
        console.error(`Document with id "${id}" not found`);
      } else {
        console.error(`Error reading document with id "${id}":`, error);
      }
      throw error;
    }
  }

  public async saveDoc(doc: IDocument): Promise<IDocument> {
    try {
      const response = await this.db.put(doc);
      return { ...doc, _rev: response.rev };
    } catch (error) {
      if ((error as PouchDB.Core.Error).status === 409) {
        console.error('Document update conflict, retrying...');
        const existingDoc = await this.db.get(doc._id);
        doc._rev = existingDoc._rev;
        return this.saveDoc(doc);
      } else {
        console.error('Error saving document:', error);
        throw error;
      }
    }
  }

  public async upsertDoc(docId: string, diffFunc: any): Promise<any> {
    return this.db.upsert(docId, diffFunc);
  }

  public async deleteDoc(id: string, rev: string): Promise<void> {
    try {
      await this.db.remove(id, rev);
      console.log(`Document with id "${id}" deleted successfully`);
    } catch (error) {
      console.error(`Error deleting document with id "${id}":`, error);
      throw error;
    }
  }

  public async bulkDocs(
    docs: IDocument[],
  ): Promise<(PouchDB.Core.Response | PouchDB.Core.Error)[]> {
    try {
      const result = await this.db.bulkDocs(docs);
      console.log(`${result.length} documents processed in bulk operation`);
      return result;
    } catch (error) {
      console.error('Error in bulk operation:', error);
      throw error;
    }
  }

  public async createOrUpdateIndex(
    indexDef: PouchDB.Find.CreateIndexOptions,
  ): Promise<void> {
    try {
      await this.db.createIndex(indexDef);
      console.log('Index created or updated successfully');
    } catch (error) {
      console.error('Error creating or updating index:', error);
      throw error;
    }
  }
}

export default PouchDBModel;
