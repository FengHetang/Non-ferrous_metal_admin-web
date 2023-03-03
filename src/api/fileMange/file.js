import request from '@/utils/request'

// 获取所有文件
export function getFileData(data){
  return(request({
    url:"/portal/upload/bsearch",
    method:'get',
    params:data
  }))
}

// 删除文件
export function delFileData(data){
  return(request({
    url:"/portal/upload/deleteFile/" + data,
    method:'delete',
  }))
}

export function uploadFileData(id,data){
  return(request({
    url:'/portal/upload/uploadFiles/' + id,
    method:'post',
    data:data
  }))
}


export function downloadFileData(data){
  return(request({
    url:'/portal/download/' + data,
    method:'post',
  }))
}

