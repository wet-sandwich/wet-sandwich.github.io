import { browser } from "$app/env";
import db from "#lib/Database.ts";

class ProjectList {
  #names: string[] = $state([]);
  #loaded = false;

  get names(): string[] {
    if (!this.#loaded && browser) {
      this.#loaded = true;
      this.#refresh();
      db.on("addProject", () => this.#refresh());
      db.on("updateProject", () => this.#refresh());
      db.on("deleteProject", () => this.#refresh());
    }
    return this.#names;
  }

  async #refresh() {
    const projects = await db.getProjects();
    this.#names = projects.map((p) => p.name);
  }
}

const projects = new ProjectList();
export default projects;
