

export default class UserController{
    async register(req: Request, res: Response): Promise<Response> {
        try{
            const {username,email,password} = req.body
            const user = await 
            
        }catch(err){
            console.log(err)
        }
    }
}