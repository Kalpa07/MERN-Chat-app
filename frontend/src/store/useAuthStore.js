import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

// const BASE_URL = "http://localhost:5001";
const BASE_URL = import.meta.env.MODE ==="development"? "http://localhost:5001" : "/";


export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUP:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth: async() =>{
        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
            get().connectSocket();
        }catch(error){
            console.log("Error in checkAuth: ",error);
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})

        }
    },

    signUp: async(data) =>{
        set({isSigningUP:true});
        try{
            const res = await axiosInstance.post("/auth/signup",data);
            toast.success("Account Created Successfully!")
            set({authUser:res.data});
            get().connectSocket();
        }catch(error){
            toast.error(error.response.data.message);
            set({authUser:null});
        }finally{
            set({isSigningUP:false});
        }
    },

    login: async(data) =>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged In Successfully!")

            get().connectSocket();
        }catch(error){
            toast.error(error.response);
            set({authUser:null});
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout: async() =>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged Out Successfully!");
            get().disconnectSocket();
        }catch(error){
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async(data) =>{
        set({isUpdatingProfile:true});
        try{
            const res = await axiosInstance.put("/auth/update-profile",data);

            toast.success("User Updated Successfully!")
            set({authUser:res.data});
        }catch(error){
            toast.error(error.response.data.message);
            set({authUser:null});
        }finally{
            set({isUpdatingProfile:false});
        }
    },

    connectSocket:()=>{
        const {authUser,socket} = get();
        if(!authUser)return;
        if (socket && socket?.connected) return; //socket.connected return if the socket is already connected or not

        const newSocket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
          });
        newSocket.connect();
        set({socket:newSocket});

        //getOnlineUsers is the name of the method for io.emit, so it should be same
        newSocket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers:userIds});
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();

        // set({socket:null});
    }
}))

