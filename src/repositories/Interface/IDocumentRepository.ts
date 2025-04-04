import { IDocument } from "../../models/documentSchema";

export interface IDocumentRepository{
    uploadDocument(doc:IDocument):Promise<IDocument>
    getDocuments(clientId:string,advisorId:string):Promise<IDocument[]>
}