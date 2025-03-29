const socketIo=require("socket.io");
const crypto=require("crypto");
const initializeSocket=(server)=>{
    
    const getSecretRoomId=(userId,targetUserId)=>{
      return crypto.createHash("sha256").update([userId,targetUserId].sort().join("-")).digest("hex");
    }
    const io=socketIo(server,{
      cors:{
        origin:"http://localhost:5173",credentials: true
      }
    })

    io.on("connection",(socket)=>{
        
socket.on("joinchat",({firstName,userId,targetUserId})=>{
    const roomId=getSecretRoomId(userId,targetUserId);
    socket.join(roomId)
   console.log(firstName + ":" + "roomid" , roomId);
}),
 
socket.on("sendMessage",({firstName,userId,targetUserId ,text})=>{
  const roomId=getSecretRoomId(userId,targetUserId);
 console.log(firstName + ":" + "roomid" , roomId);
    io.to(roomId).emit("receivedMessage" , {firstName, text})
 }),
socket.on("disconnect",()=>{})
    })
    return io;
}

module.exports=initializeSocket;