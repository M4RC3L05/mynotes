import * as ScopedStorage from "react-native-scoped-storage";

import type { NoteFile } from "../../domain/models/note-file";
import type { INoteRepository } from "../../domain/repositories/inote-repository";
import { fileTypeToNoteFile } from "../mappers/scoped-storage-mappers";

export class NoteRepository implements INoteRepository {
  async renameNote(note: NoteFile, newName: string): Promise<string> {
    return ScopedStorage.rename(note.uri, `${newName}.md`);
  }

  async createNoteFile(dirUri: string, name: string): Promise<NoteFile> {
    const created = await ScopedStorage.createFile(dirUri, `${name}.md`, "text/markdown");

    return fileTypeToNoteFile(created);
  }

  async deleteNoteFile(note: NoteFile): Promise<boolean> {
    await ScopedStorage.deleteFile(note.uri);

    return true;
  }

  async getNoteFiles(dirUri: string): Promise<NoteFile[]> {
    const notes = await ScopedStorage.listFiles(dirUri);

    return notes.filter(({ mime }) => mime === "text/markdown").map(fileTypeToNoteFile);
  }

  async getNoteFileContents(note: NoteFile): Promise<string> {
    const raw = await ScopedStorage.readFile(note.uri, "utf8");

    return raw;
  }

  async saveNoteContents(dirUri: string, note: NoteFile, data: string): Promise<string> {
    const filePathUri = await ScopedStorage.writeFile(dirUri, data, note.name, "text/markdown", "utf8", false);

    return filePathUri;
  }
}
