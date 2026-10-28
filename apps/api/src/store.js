import fs from 'node:fs';
import path from 'node:path';
import { initialDatabase } from './seed.js';

export class JsonStore {
  constructor(file) { this.file = file; this.data = null; this.queue = Promise.resolve(); }
  load() {
    if (this.data) return this.data;
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    if (!fs.existsSync(this.file)) this.write(initialDatabase());
    this.data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
    return this.data;
  }
  write(data) {
    const temporary = `${this.file}.tmp`;
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(temporary, JSON.stringify(data, null, 2));
    fs.renameSync(temporary, this.file);
    this.data = data;
  }
  transaction(operation) {
    const run = this.queue.then(async () => {
      const draft = structuredClone(this.load());
      const result = await operation(draft);
      this.write(draft);
      return result;
    });
    this.queue = run.catch(() => {});
    return run;
  }
}
