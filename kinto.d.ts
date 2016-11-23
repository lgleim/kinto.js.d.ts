declare module "kinto" {
  export default class Kinto extends KintoBase {
      /**
       * Provides a public access to the base adapter classes. Users can create
       * a custom DB adapter by extending BaseAdapter.
       *
       * @type {Object}
       */
      static readonly adapters: {
          BaseAdapter: typeof BaseAdapter;
          IDB: typeof IDB;
      };
      constructor(options?: {});
  }

  export interface Record {
      id?: string;
      last_modified?: number;
      [propName: string]: any;
  }
  export interface SyncOptions {
      strategy?: any;
      lastModified?: any;
      headers?: any;
      exclude?: any;
  }
  /**
   * Compare two records omitting local fields and synchronization
   * attributes (like _status and last_modified)
   * @param {Object} a    A record to compare.
   * @param {Object} b    A record to compare.
   * @return {boolean}
   */
  export function recordsEqual(a: any, b: any, localFields?: any[]): boolean;
  /**
   * Synchronization result object.
   */
  export class SyncResultObject {
      ok: boolean;
      lastModified: number | null;
      errors: any[];
      created: any[];
      updated: any[];
      deleted: any[];
      published: any[];
      conflicts: any[];
      skipped: any[];
      resolved: any[];
      /**
       * Object default values.
       * @type {Object}
       */
      static readonly defaults: {
          ok: boolean;
          lastModified: any;
          errors: any[];
          created: any[];
          updated: any[];
          deleted: any[];
          published: any[];
          conflicts: any[];
          skipped: any[];
          resolved: any[];
      };
      /**
       * Public constructor.
       */
      constructor();
      /**
       * Adds entries for a given result type.
       *
       * @param {String} type    The result type.
       * @param {Array}  entries The result entries.
       * @return {SyncResultObject}
       */
      add(type: any, entries: any): this;
      /**
       * Reinitializes result entries for a given result type.
       *
       * @param  {String} type The result type.
       * @return {SyncResultObject}
       */
      reset(type: any): this;
  }
  export interface CollectionOptions {
      adapter?: any;
      adapterOptions?: Object;
      dbPrefix?: String;
      events?: any;
      idSchema?: any;
      localFields?: any;
      remoteTransformers?: any;
      hooks?: any;
  }
  /**
   * Abstracts a collection of records stored in the local database, providing
   * CRUD operations and synchronization helpers.
   */
  export class Collection {
      private _bucket;
      private _name;
      private _lastModified;
      db: BaseAdapter;
      api: any;
      events: any;
      idSchema: any;
      remoteTransformers: any;
      hooks: any;
      localFields: any;
      /**
       * Constructor.
       *
       * Options:
       * - `{BaseAdapter} adapter` The DB adapter (default: `IDB`)
       * - `{String} dbPrefix`     The DB name prefix (default: `""`)
       *
       * @param  {String} bucket  The bucket identifier.
       * @param  {String} name    The collection name.
       * @param  {Api}    api     The Api instance.
       * @param  {Object} options The options object.
       */
      constructor(bucket: any, name: any, api: any, options?: CollectionOptions);
      /**
       * The collection name.
       * @type {String}
       */
      readonly name: any;
      /**
       * The bucket name.
       * @type {String}
       */
      readonly bucket: any;
      /**
       * The last modified timestamp.
       * @type {Number}
       */
      readonly lastModified: any;
      /**
       * Synchronization strategies. Available strategies are:
       *
       * - `MANUAL`: Conflicts will be reported in a dedicated array.
       * - `SERVER_WINS`: Conflicts are resolved using remote data.
       * - `CLIENT_WINS`: Conflicts are resolved using local data.
       *
       * @type {Object}
       */
      static readonly strategy: {
          CLIENT_WINS: string;
          SERVER_WINS: string;
          MANUAL: string;
      };
      /**
       * Validates an idSchema.
       *
       * @param  {Object|undefined} idSchema
       * @return {Object}
       */
      _validateIdSchema(idSchema: any): any;
      /**
       * Validates a list of remote transformers.
       *
       * @param  {Array|undefined} remoteTransformers
       * @return {Array}
       */
      _validateRemoteTransformers(remoteTransformers: any): any[];
      /**
       * Validate the passed hook is correct.
       *
       * @param {Array|undefined} hook.
       * @return {Array}
       **/
      _validateHook(hook: any): any[];
      /**
       * Validates a list of hooks.
       *
       * @param  {Object|undefined} hooks
       * @return {Object}
       */
      _validateHooks(hooks: any): {};
      /**
       * Deletes every records in the current collection and marks the collection as
       * never synced.
       *
       * @return {Promise}
       */
      clear(): Promise<{
          data: any[];
          permissions: {};
      }>;
      /**
       * Encodes a record.
       *
       * @param  {String} type   Either "remote" or "local".
       * @param  {Object} record The record object to encode.
       * @return {Promise}
       */
      _encodeRecord(type: any, record: any): Promise<any>;
      /**
       * Decodes a record.
       *
       * @param  {String} type   Either "remote" or "local".
       * @param  {Object} record The record object to decode.
       * @return {Promise}
       */
      _decodeRecord(type: any, record: any): Promise<any>;
      /**
       * Adds a record to the local database, asserting that none
       * already exist with this ID.
       *
       * Note: If either the `useRecordId` or `synced` options are true, then the
       * record object must contain the id field to be validated. If none of these
       * options are true, an id is generated using the current IdSchema; in this
       * case, the record passed must not have an id.
       *
       * Options:
       * - {Boolean} synced       Sets record status to "synced" (default: `false`).
       * - {Boolean} useRecordId  Forces the `id` field from the record to be used,
       *                          instead of one that is generated automatically
       *                          (default: `false`).
       *
       * @param  {Object} record
       * @param  {Object} options
       * @return {Promise}
       */
      create(record: any, options?: {
          useRecordId: boolean;
          synced: boolean;
      }): Promise<any>;
      /**
       * Like {@link CollectionTransaction#update}, but wrapped in its own transaction.
       *
       * Options:
       * - {Boolean} synced: Sets record status to "synced" (default: false)
       * - {Boolean} patch:  Extends the existing record instead of overwriting it
       *   (default: false)
       *
       * @param  {Object} record
       * @param  {Object} options
       * @return {Promise}
       */
      update(record: any, options?: {
          synced: boolean;
          patch: boolean;
      }): Promise<any>;
      /**
       * Like {@link CollectionTransaction#upsert}, but wrapped in its own transaction.
       *
       * @param  {Object} record
       * @return {Promise}
       */
      upsert(record: any): Promise<any>;
      /**
       * Like {@link CollectionTransaction#get}, but wrapped in its own transaction.
       *
       * Options:
       * - {Boolean} includeDeleted: Include virtually deleted records.
       *
       * @param  {String} id
       * @param  {Object} options
       * @return {Promise}
       */
      get(id: any, options?: {
          includeDeleted: boolean;
      }): Promise<any>;
      /**
       * Like {@link CollectionTransaction#getAny}, but wrapped in its own transaction.
       *
       * @param  {String} id
       * @return {Promise}
       */
      getAny(id: any): Promise<any>;
      /**
       * Same as {@link Collection#delete}, but wrapped in its own transaction.
       *
       * Options:
       * - {Boolean} virtual: When set to `true`, doesn't actually delete the record,
       *   update its `_status` attribute to `deleted` instead (default: true)
       *
       * @param  {String} id       The record's Id.
       * @param  {Object} options  The options object.
       * @return {Promise}
       */
      delete(id: any, options?: {
          virtual: boolean;
      }): Promise<any>;
      /**
       * The same as {@link CollectionTransaction#deleteAny}, but wrapped
       * in its own transaction.
       *
       * @param  {String} id       The record's Id.
       * @return {Promise}
       */
      deleteAny(id: any): Promise<any>;
      /**
       * Lists records from the local database.
       *
       * Params:
       * - {Object} filters Filter the results (default: `{}`).
       * - {String} order   The order to apply   (default: `-last_modified`).
       *
       * Options:
       * - {Boolean} includeDeleted: Include virtually deleted records.
       *
       * @param  {Object} params  The filters and order to apply to the results.
       * @param  {Object} options The options object.
       * @return {Promise}
       */
      list(params?: {}, options?: {
          includeDeleted: boolean;
      }): Promise<{
          data: any;
          permissions: {};
      }>;
      /**
       * Imports remote changes into the local database.
       * This method is in charge of detecting the conflicts, and resolve them
       * according to the specified strategy.
       * @param  {SyncResultObject} syncResultObject The sync result object.
       * @param  {Array}            decodedChanges   The list of changes to import in the local database.
       * @param  {String}           strategy         The {@link Collection.strategy} (default: MANUAL)
       * @return {Promise}
       */
      importChanges(syncResultObject: any, decodedChanges: any, strategy?: string): Promise<any>;
      /**
       * Imports the responses of pushed changes into the local database.
       * Basically it stores the timestamp assigned by the server into the local
       * database.
       * @param  {SyncResultObject} syncResultObject The sync result object.
       * @param  {Array}            toApplyLocally   The list of changes to import in the local database.
       * @param  {Array}            conflicts        The list of conflicts that have to be resolved.
       * @param  {String}           strategy         The {@link Collection.strategy}.
       * @return {Promise}
       */
      _applyPushedResults(syncResultObject: any, toApplyLocally: any, conflicts: any, strategy?: string): Promise<any>;
      /**
       * Handles synchronization conflicts according to specified strategy.
       *
       * @param  {SyncResultObject} result    The sync result object.
       * @param  {String}           strategy  The {@link Collection.strategy}.
       * @return {Promise}
       */
      _handleConflicts(transaction: any, conflicts: any, strategy: any): any;
      /**
       * Execute a bunch of operations in a transaction.
       *
       * This transaction should be atomic -- either all of its operations
       * will succeed, or none will.
       *
       * The argument to this function is itself a function which will be
       * called with a {@link CollectionTransaction}. Collection methods
       * are available on this transaction, but instead of returning
       * promises, they are synchronous. execute() returns a Promise whose
       * value will be the return value of the provided function.
       *
       * Most operations will require access to the record itself, which
       * must be preloaded by passing its ID in the preloadIds option.
       *
       * Options:
       * - {Array} preloadIds: list of IDs to fetch at the beginning of
       *   the transaction
       *
       * @return {Promise} Resolves with the result of the given function
       *    when the transaction commits.
       */
      execute(doOperations: any, {preloadIds}?: {
          preloadIds?: any[];
      }): Promise<any>;
      /**
       * Resets the local records as if they were never synced; existing records are
       * marked as newly created, deleted records are dropped.
       *
       * A next call to {@link Collection.sync} will thus republish the whole
       * content of the local collection to the server.
       *
       * @return {Promise} Resolves with the number of processed records.
       */
      resetSyncStatus(): Promise<any>;
      /**
       * Returns an object containing two lists:
       *
       * - `toDelete`: unsynced deleted records we can safely delete;
       * - `toSync`: local updates to send to the server.
       *
       * @return {Promise}
       */
      gatherLocalChanges(): Promise<{
          toSync: {}[];
          toDelete: {}[];
      }>;
      /**
       * Fetch remote changes, import them to the local database, and handle
       * conflicts according to `options.strategy`. Then, updates the passed
       * {@link SyncResultObject} with import results.
       *
       * Options:
       * - {String} strategy: The selected sync strategy.
       *
       * @param  {KintoClient.Collection} client           Kinto client Collection instance.
       * @param  {SyncResultObject}       syncResultObject The sync result object.
       * @param  {Object}                 options
       * @return {Promise}
       */
      pullChanges(client: any, syncResultObject: any, options?: SyncOptions): Promise<any>;
      applyHook(hookName: any, payload: any): Promise<any>;
      /**
       * Publish local changes to the remote server and updates the passed
       * {@link SyncResultObject} with publication results.
       *
       * @param  {KintoClient.Collection} client           Kinto client Collection instance.
       * @param  {SyncResultObject}       syncResultObject The sync result object.
       * @param  {Object}                 changes          The change object.
       * @param  {Array}                  changes.toDelete The list of records to delete.
       * @param  {Array}                  changes.toSync   The list of records to create/update.
       * @param  {Object}                 options          The options object.
       * @return {Promise}
       */
      pushChanges(client: any, {toDelete, toSync}: {
          toDelete?: any[];
          toSync: any;
      }, syncResultObject: any, options?: SyncOptions): Promise<any>;
      /**
       * Return a copy of the specified record without the local fields.
       *
       * @param  {Object} record  A record with potential local fields.
       * @return {Object}
       */
      cleanLocalFields(record: any): Object;
      /**
       * Resolves a conflict, updating local record according to proposed
       * resolution — keeping remote record `last_modified` value as a reference for
       * further batch sending.
       *
       * @param  {Object} conflict   The conflict object.
       * @param  {Object} resolution The proposed record.
       * @return {Promise}
       */
      resolve(conflict: any, resolution: any): Promise<any>;
      /**
       * @private
       */
      _resolveRaw(conflict: any, resolution: any): any;
      /**
       * Synchronize remote and local data. The promise will resolve with a
       * {@link SyncResultObject}, though will reject:
       *
       * - if the server is currently backed off;
       * - if the server has been detected flushed.
       *
       * Options:
       * - {Object} headers: HTTP headers to attach to outgoing requests.
       * - {Collection.strategy} strategy: See {@link Collection.strategy}.
       * - {Boolean} ignoreBackoff: Force synchronization even if server is currently
       *   backed off.
       * - {String} bucket: The remove bucket id to use (default: null)
       * - {String} collection: The remove collection id to use (default: null)
       * - {String} remote The remote Kinto server endpoint to use (default: null).
       *
       * @param  {Object} options Options.
       * @return {Promise}
       * @throws {Error} If an invalid remote option is passed.
       */
      sync(options?: {
          strategy: string;
          headers: {};
          ignoreBackoff: boolean;
          bucket: any;
          collection: any;
          remote: any;
      }): Promise<SyncResultObject>;
      /**
       * Load a list of records already synced with the remote server.
       *
       * The local records which are unsynced or whose timestamp is either missing
       * or superior to those being loaded will be ignored.
       *
       * @param  {Array} records The previously exported list of records to load.
       * @return {Promise} with the effectively imported records.
       */
      loadDump(records: any): Promise<any>;
  }
  /**
   * A Collection-oriented wrapper for an adapter's transaction.
   *
   * This defines the high-level functions available on a collection.
   * The collection itself offers functions of the same name. These will
   * perform just one operation in its own transaction.
   */
  export class CollectionTransaction {
      private _events;
      collection: any;
      adapterTransaction: any;
      localFields: any;
      constructor(collection: any, adapterTransaction: any);
      _queueEvent(action: any, payload: any): void;
      /**
       * Emit queued events, to be called once every transaction operations have
       * been executed successfully.
       */
      emitEvents(): void;
      /**
       * Retrieve a record by its id from the local database, or
       * undefined if none exists.
       *
       * This will also return virtually deleted records.
       *
       * @param  {String} id
       * @return {Object}
       */
      getAny(id: any): {
          data: any;
          permissions: {};
      };
      /**
       * Retrieve a record by its id from the local database.
       *
       * Options:
       * - {Boolean} includeDeleted: Include virtually deleted records.
       *
       * @param  {String} id
       * @param  {Object} options
       * @return {Object}
       */
      get(id: any, options?: {
          includeDeleted: boolean;
      }): {
          data: any;
          permissions: {};
      };
      /**
       * Deletes a record from the local database.
       *
       * Options:
       * - {Boolean} virtual: When set to `true`, doesn't actually delete the record,
       *   update its `_status` attribute to `deleted` instead (default: true)
       *
       * @param  {String} id       The record's Id.
       * @param  {Object} options  The options object.
       * @return {Object}
       */
      delete(id: any, options?: {
          virtual: boolean;
      }): {
          data: any;
          permissions: {};
      };
      /**
       * Deletes a record from the local database, if any exists.
       * Otherwise, do nothing.
       *
       * @param  {String} id       The record's Id.
       * @return {Object}
       */
      deleteAny(id: any): {
          data: any;
          deleted: boolean;
          permissions: {};
      };
      /**
       * Adds a record to the local database, asserting that none
       * already exist with this ID.
       *
       * @param  {Object} record, which must contain an ID
       * @return {Object}
       */
      create(record: any): {
          data: any;
          permissions: {};
      };
      /**
       * Updates a record from the local database.
       *
       * Options:
       * - {Boolean} synced: Sets record status to "synced" (default: false)
       * - {Boolean} patch:  Extends the existing record instead of overwriting it
       *   (default: false)
       *
       * @param  {Object} record
       * @param  {Object} options
       * @return {Object}
       */
      update(record: any, options?: {
          synced: boolean;
          patch: boolean;
      }): {
          data: any;
          oldRecord: any;
          permissions: {};
      };
      /**
       * Lower-level primitive for updating a record while respecting
       * _status and last_modified.
       *
       * @param  {Object} oldRecord: the record retrieved from the DB
       * @param  {Object} newRecord: the record to replace it with
       * @return {Object}
       */
      _updateRaw(oldRecord: any, newRecord: any, {synced}?: {
          synced?: boolean;
      }): any;
      /**
       * Upsert a record into the local database.
       *
       * This record must have an ID.
       *
       * If a record with this ID already exists, it will be replaced.
       * Otherwise, this record will be inserted.
       *
       * @param  {Object} record
       * @return {Object}
       */
      upsert(record: any): {
          data: any;
          oldRecord: any;
          permissions: {};
      };
  }
  export const RE_UUID: RegExp;
  /**
   * Sorts records in a list according to a given ordering.
   *
   * @param  {String} order The ordering, eg. `-last_modified`.
   * @param  {Array}  list  The collection to order.
   * @return {Array}
   */
  export function sortObjects(order: string, list: any[]): any[];
  /**
   * Test if a single object matches all given filters.
   *
   * @param  {Object} filters  The filters object.
   * @param  {Object} entry    The object to filter.
   * @return {Boolean}
   */
  export function filterObject(filters: Object, entry: Object): boolean;
  /**
   * Filters records in a list matching all given filters.
   *
   * @param  {Object} filters  The filters object.
   * @param  {Array}  list     The collection to filter.
   * @return {Array}
   */
  export function filterObjects(filters: Object, list: any[]): any[];
  /**
   * Checks if a string is an UUID.
   *
   * @param  {String} uuid The uuid to validate.
   * @return {Boolean}
   */
  export function isUUID(uuid: string): boolean;
  /**
   * Resolves a list of functions sequentially, which can be sync or async; in
   * case of async, functions must return a promise.
   *
   * @param  {Array} fns  The list of functions.
   * @param  {Any}   init The initial value.
   * @return {Promise}
   */
  export function waterfall(fns: any[], init: any): Promise<any>;
  /**
   * Simple deep object comparison function. This only supports comparison of
   * serializable JavaScript objects.
   *
   * @param  {Object} a The source object.
   * @param  {Object} b The compared object.
   * @return {Boolean}
   */
  export function deepEqual(a: Object, b: Object): boolean;
  /**
   * Return an object without the specified keys.
   *
   * @param  {Object} obj        The original object.
   * @param  {Array}  keys       The list of keys to exclude.
   * @return {Object}            A copy without the specified keys.
   */
  export function omitKeys(obj: Object, keys?: any[]): Object;
  /**
   * Interface to provide filtering and ordering parameters to the list function
   */
  export interface ListParameters {
      filters?: Object;
      order?: string;
  }
  /**
   * Base db adapter.
   *
   * @abstract
   */
  export class BaseAdapter {
      protected _db: IDBDatabase;
      /**
       * The database name.
       * @type {String}
       */
      dbname: string;
      /**
       * Opens a connection to the database.
       *
       * @abstract
       * @return {Promise}
       */
      open(): Promise<any>;
      /**
       * Closes current connection to the database.
       *
       * @abstract
       * @return {Promise}
       */
      close(): Promise<any>;
      /**
       * Deletes every records present in the database.
       *
       * @abstract
       * @return {Promise}
       */
      clear(): Promise<any>;
      /**
       * Executes a batch of operations within a single transaction.
       *
       * @abstract
       * @param  {Function} callback The operation callback.
       * @param  {Object}   options  The options object.
       * @return {Promise}
       */
      execute(callback: Function, options?: Object): Promise<any>;
      /**
       * Retrieve a record by its primary key from the database.
       *
       * @abstract
       * @param  {String} id The record id.
       * @return {Promise}
       */
      get(id: string): Promise<any>;
      /**
       * Lists all records from the database.
       *
       * @abstract
       * @param  {Object} params  The filters and order to apply to the results.
       * @return {Promise}
       */
      list(params?: ListParameters): Promise<any>;
      /**
       * Store the lastModified value.
       *
       * @abstract
       * @param  {Number}  lastModified
       * @return {Promise}
       */
      saveLastModified(lastModified: any): Promise<any>;
      /**
       * Retrieve saved lastModified value.
       *
       * @abstract
       * @return {Promise}
       */
      getLastModified(): Promise<number>;
      /**
       * Load a dump of records exported from a server.
       *
       * @abstract
       * @return {Promise}
       */
      loadDump(records: any): Promise<any>;
  }

  /**
   * IndexedDB adapter.
   *
   * This adapter doesn't support any options.
   */
  export class IDB extends BaseAdapter {
      /**
       * Constructor.
       *
       * @param  {String} dbname The database nale.
       */
      constructor(dbname: string);
      _handleError(method: any, err: any): void;
      /**
       * Ensures a connection to the IndexedDB database has been opened.
       *
       * @override
       * @return {Promise}
       */
      open(): Promise<IDB>;
      /**
       * Closes current connection to the database.
       *
       * @override
       * @return {Promise}
       */
      close(): Promise<any>;
      /**
       * Returns a transaction and a store objects for this collection.
       *
       * To determine if a transaction has completed successfully, we should rather
       * listen to the transaction’s complete event rather than the IDBObjectStore
       * request’s success event, because the transaction may still fail after the
       * success event fires.
       *
       * @param  {String}      mode  Transaction mode ("readwrite" or undefined)
       * @param  {String|null} name  Store name (defaults to coll name)
       * @return {Object}
       */
      prepare(mode?: string | undefined, name?: string | null): {
          transaction: IDBTransaction;
          store: IDBObjectStore;
      };
      /**
       * Deletes every records in the current collection.
       *
       * @override
       * @return {Promise}
       */
      clear(): Promise<{}>;
      /**
       * Executes the set of synchronous CRUD operations described in the provided
       * callback within an IndexedDB transaction, for current db store.
       *
       * The callback will be provided an object exposing the following synchronous
       * CRUD operation methods: get, create, update, delete.
       *
       * Important note: because limitations in IndexedDB implementations, no
       * asynchronous code should be performed within the provided callback; the
       * promise will therefore be rejected if the callback returns a Promise.
       *
       * Options:
       * - {Array} preload: The list of record IDs to fetch and make available to
       *   the transaction object get() method (default: [])
       *
       * @example
       * const db = new IDB("example");
       * db.execute(transaction => {
       *   transaction.create({id: 1, title: "foo"});
       *   transaction.update({id: 2, title: "bar"});
       *   transaction.delete(3);
       *   return "foo";
       * })
       *   .catch(console.error.bind(console));
       *   .then(console.log.bind(console)); // => "foo"
       *
       * @param  {Function} callback The operation description callback.
       * @param  {Object}   options  The options object.
       * @return {Promise}
       */
      execute(callback: any, options?: {
          preload: any[];
      }): Promise<{}>;
      /**
       * Retrieve a record by its primary key from the IndexedDB database.
       *
       * @override
       * @param  {String} id The record id.
       * @return {Promise}
       */
      get(id: any): Promise<{}>;
      /**
       * Lists all records from the IndexedDB database.
       *
       * @override
       * @return {Promise}
       */
      list(params?: ListParameters): Promise<any[]>;
      /**
       * Store the lastModified value into metadata store.
       *
       * @override
       * @param  {Number}  lastModified
       * @return {Promise}
       */
      saveLastModified(lastModified: any): Promise<{}>;
      /**
       * Retrieve saved lastModified value.
       *
       * @override
       * @return {Promise}
       */
      getLastModified(): Promise<{}>;
      /**
       * Load a dump of records exported from a server.
       *
       * @abstract
       * @return {Promise}
       */
      loadDump(records: any[]): Promise<any[]>;
  }

  /**
   * KintoBase class.
   */
  export class KintoBase {
      private _options;
      api: any;
      events: any;
      /**
       * Provides a public access to the base adapter class. Users can create a
       * custom DB adapter by extending {@link BaseAdapter}.
       *
       * @type {Object}
       */
      static readonly adapters: {
          BaseAdapter: typeof BaseAdapter;
      };
      /**
       * Synchronization strategies. Available strategies are:
       *
       * - `MANUAL`: Conflicts will be reported in a dedicated array.
       * - `SERVER_WINS`: Conflicts are resolved using remote data.
       * - `CLIENT_WINS`: Conflicts are resolved using local data.
       *
       * @type {Object}
       */
      static readonly syncStrategy: {
          CLIENT_WINS: string;
          SERVER_WINS: string;
          MANUAL: string;
      };
      /**
       * Constructor.
       *
       * Options:
       * - `{String}`       `remote`         The server URL to use.
       * - `{String}`       `bucket`         The collection bucket name.
       * - `{EventEmitter}` `events`         Events handler.
       * - `{BaseAdapter}`  `adapter`        The base DB adapter class.
       * - `{Object}`       `adapterOptions` Options given to the adapter.
       * - `{String}`       `dbPrefix`       The DB name prefix.
       * - `{Object}`       `headers`        The HTTP headers to use.
       * - `{String}`       `requestMode`    The HTTP CORS mode to use.
       * - `{Number}`       `timeout`        The requests timeout in ms (default: `5000`).
       *
       * @param  {Object} options The options object.
       */
      constructor(options?: {});
      /**
       * Creates a {@link Collection} instance. The second (optional) parameter
       * will set collection-level options like e.g. `remoteTransformers`.
       *
       * @param  {String} collName The collection name.
       * @param  {Object} options  May contain the following fields:
       *                           remoteTransformers: Array<RemoteTransformer>
       * @return {Collection}
       */
      collection(collName: any, options?: any): Collection;
  }
}

