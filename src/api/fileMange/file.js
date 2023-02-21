import request from '@/utils/request'

// 获取所有文件
export function getFileData(){
  return(request({
    url:"",
    method:'get'
  }))
}

// 删除文件
export function delFileData(data){
  return(request({
    url:"",
    method:'delete',
    data:{
      fileId:data
    }
  }))
}

export function uploadFileData(data){
  return(request({
    url:'/portal/upload/uploadFiles/',
    method:'post',
    data:{
      navigationId:data
    }
  }))
}

export function downloadFileData(data){
  return(request({
    url:'portal/download',
    method:'post',
    data:{
      fileId:data
    }
  }))
}
