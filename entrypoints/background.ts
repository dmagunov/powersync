import {
  PowerSyncDatabase,
  WASQLiteOpenFactory,
  WASQLiteVFS,
  type QueryResult,
  column,
  Schema,
  Table,
} from "@powersync/web";

const articles = new Table({
  url: column.text,
  title: column.text,
});

const AppSchema = new Schema({
  articles,
});

export default defineBackground(async () => {
  console.log("Hello background!", { id: browser.runtime.id });

  const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: new WASQLiteOpenFactory({
      dbFilename: "baloonza-extension.db",
      vfs: WASQLiteVFS.IDBBatchAtomicVFS,
      encryptionKey: "baloonza-extension",
    }),
    flags: {
      ssrMode: false,
      useWebWorker: false,
      disableSSRWarning: true,
    },
  });

  await db.init();
});
