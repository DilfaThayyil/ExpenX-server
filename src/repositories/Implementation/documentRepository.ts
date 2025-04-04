import documentSchema, { IDocument } from "../../models/documentSchema";
import { IDocumentRepository } from "../Interface/IDocumentRepository";
import { BaseRepository } from "./baseRepository";

export default class DocumentRepository extends BaseRepository<IDocument> implements IDocumentRepository{
    constructor(){
        super(documentSchema)
    }
    async uploadDocument(doc:IDocument):Promise<IDocument>{
        return this.create(doc)
    }

    async getDocuments(clientId: string, advisorId: string): Promise<IDocument[]> {
        return this.findAll({ userId: clientId, advisorId: advisorId });
    }      
    
}