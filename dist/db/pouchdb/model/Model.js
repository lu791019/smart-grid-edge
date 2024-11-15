'use strict';
// import PouchDB from 'pouchdb';
// import PouchDBFind from 'pouchdb-find';
// import PouchDBHttp from 'pouchdb-adapter-http';
// import * as dotenv from 'dotenv';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// PouchDB.plugin(PouchDBHttp);
// PouchDB.plugin(PouchDBFind);
// dotenv.config();
// interface IDocument {
//   _id: string;
//   [key: string]: any;
// }
// class PouchDBModel {
//   private static instance: PouchDBModel | null = null;
//   protected db!: PouchDB.Database<{}>;
//   private constructor() {
//     const remoteUrl = process.env.REMOTE_DB_URL;
//     console.log(remoteUrl);
//     if (!remoteUrl) {
//       throw new Error(
//         'REMOTE_DB_URL is not defined in the environment variables',
//       );
//     }
//     console.log('init');
//     this.db = new PouchDB(remoteUrl);
//     this.createIndex();
//   }
//   public static getInstance(): PouchDBModel {
//     console.log('getInstance');
//     if (!PouchDBModel.instance) {
//       console.log('new');
//       PouchDBModel.instance = new PouchDBModel();
//     }
//     return PouchDBModel.instance;
//   }
//   private async createIndex() {
//     try {
//       await this.db.createIndex({
//         index: {
//           fields: ['table'],
//         },
//       });
//       console.log('Index on table created successfully');
//     } catch (error) {
//       console.error('Error creating index:', error);
//     }
//   }
//   public async readAllDocs(): Promise<IDocument[]> {
//     try {
//       const result = await this.db.allDocs({ include_docs: true });
//       return result.rows.map((row) => row.doc as IDocument);
//     } catch (error) {
//       console.error('Error reading data:', error);
//       throw error;
//     }
//   }
//   public async readDocByTable(table: string): Promise<IDocument[]> {
//     try {
//       const result = await this.db.find({
//         selector: {
//           table: table,
//         },
//       });
//       return result.docs as IDocument[];
//     } catch (error) {
//       console.error('Error reading document:', error);
//       throw error;
//     }
//   }
//   public async readDocById(id: string): Promise<IDocument> {
//     try {
//       const doc = await this.db.get(id);
//       return doc as IDocument;
//     } catch (error) {
//       if ((error as PouchDB.Core.Error).status !== 404) {
//         console.error('Error reading document:', error);
//       }
//       throw error;
//     }
//   }
//   public async saveDoc(doc: IDocument): Promise<void> {
//     try {
//       const existingDoc = await this.db.get(doc._id);
//       doc._rev = existingDoc._rev;
//     } catch (error) {
//       if ((error as PouchDB.Core.Error).status !== 404) {
//         console.error('Error fetching document:', error);
//         throw error;
//       }
//     }
//     try {
//       await this.db.put(doc);
//     } catch (error) {
//       if ((error as PouchDB.Core.Error).status === 409) {
//         console.error('Document update conflict, retrying...');
//         return this.saveDoc(doc);
//       } else {
//         console.error('Error saving document:', error);
//         throw error;
//       }
//     }
//   }
//   public async deleteDoc(id: string, rev: string): Promise<void> {
//     try {
//       await this.db.remove(id, rev);
//     } catch (error) {
//       console.error('Error deleting document:', error);
//       throw error;
//     }
//   }
// }
// export default PouchDBModel;
const pouchdb_1 = __importDefault(require('pouchdb'));
const pouchdb_find_1 = __importDefault(require('pouchdb-find'));
const pouchdb_adapter_http_1 = __importDefault(require('pouchdb-adapter-http'));
const dotenv = __importStar(require('dotenv'));
pouchdb_1.default.plugin(pouchdb_adapter_http_1.default);
pouchdb_1.default.plugin(pouchdb_find_1.default);
dotenv.config();
class PouchDBModel {
  constructor() {
    const remoteUrl = process.env.REMOTE_DB_URL;
    if (!remoteUrl) {
      throw new Error(
        'REMOTE_DB_URL is not defined in the environment variables',
      );
    }
    console.log('Initializing PouchDB with remote URL:', remoteUrl);
    this.db = new pouchdb_1.default(remoteUrl);
    this.createIndex();
  }
  static getInstance() {
    if (!PouchDBModel.instance) {
      PouchDBModel.instance = new PouchDBModel();
    }
    return PouchDBModel.instance;
  }
  createIndex() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield this.db.createIndex({
          index: { fields: ['table'] },
        });
        console.log('Index on "table" field created successfully');
      } catch (error) {
        console.error('Error creating index:', error);
      }
    });
  }
  readAllDocs() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const result = yield this.db.allDocs({ include_docs: true });
        return result.rows.map((row) => row.doc);
      } catch (error) {
        console.error('Error reading all documents:', error);
        throw error;
      }
    });
  }
  readDocByTable(table) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const result = yield this.db.find({
          selector: { table: table },
        });
        return result.docs;
      } catch (error) {
        console.error(`Error reading documents from table "${table}":`, error);
        throw error;
      }
    });
  }
  readDocByObject(obj) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const result = yield this.db.find({
          selector: obj,
        });
        return result.docs;
      } catch (error) {
        console.error(`Error reading documents from table `, error);
        throw error;
      }
    });
  }
  readDocById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const doc = yield this.db.get(id);
        return doc;
      } catch (error) {
        if (error.status === 404) {
          console.error(`Document with id "${id}" not found`);
        } else {
          console.error(`Error reading document with id "${id}":`, error);
        }
        throw error;
      }
    });
  }
  saveDoc(doc) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const response = yield this.db.put(doc);
        return Object.assign(Object.assign({}, doc), { _rev: response.rev });
      } catch (error) {
        if (error.status === 409) {
          console.error('Document update conflict, retrying...');
          const existingDoc = yield this.db.get(doc._id);
          doc._rev = existingDoc._rev;
          return this.saveDoc(doc);
        } else {
          console.error('Error saving document:', error);
          throw error;
        }
      }
    });
  }
  upsert(docId, updateFunc) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const existingDoc = yield this.db.get(docId);
        const updatedDoc = updateFunc(existingDoc);
        return yield this.saveDoc(updatedDoc);
      } catch (error) {
        if (error.status === 404) {
          const newDoc = updateFunc({ _id: docId });
          return yield this.saveDoc(newDoc);
        } else {
          console.error('Error upserting document:', error);
          throw error;
        }
      }
    });
  }
  deleteDoc(id, rev) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield this.db.remove(id, rev);
        console.log(`Document with id "${id}" deleted successfully`);
      } catch (error) {
        console.error(`Error deleting document with id "${id}":`, error);
        throw error;
      }
    });
  }
  bulkDocs(docs) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const result = yield this.db.bulkDocs(docs);
        console.log(`${result.length} documents processed in bulk operation`);
        return result;
      } catch (error) {
        console.error('Error in bulk operation:', error);
        throw error;
      }
    });
  }
  createOrUpdateIndex(indexDef) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield this.db.createIndex(indexDef);
        console.log('Index created or updated successfully');
      } catch (error) {
        console.error('Error creating or updating index:', error);
        throw error;
      }
    });
  }
}
PouchDBModel.instance = null;
exports.default = PouchDBModel;
