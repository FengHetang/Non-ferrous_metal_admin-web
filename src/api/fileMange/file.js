import request from '@/utils/request'

// 获取所有文件
export function getFileData(data){
  return(request({
    url:"/portal/upload/bsearch",
    method:'get',
    data:data
  }))
}

// 删除文件
export function delFileData(data){
  return(request({
    url:"/portal/upload/deleteFile",
    method:'delete',
    data:{
      fileId:data
    }
  }))
}

export function uploadFileData(data){
  return(request({
    url:'/portal/upload/uploadFiles',
    method:'post',
    data:data
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
