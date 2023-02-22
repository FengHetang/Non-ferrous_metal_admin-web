import request from "@/utils/request";

export function getDataBackup(data){
  return(request({
    url:"/portal/backups/list",
    method:'get',
    params:data,
  }))
}


export function downloadData(data){
  return(request({
    url:'/portal/backups/download',
    method:'post',
    data:data
  }))
}

export function delData(data){
  return(request({
    url:'/portal/backups',
    method:'post',
    params:data
  }))
}

export function backupData(){
  return(request({
    url:'/portal/backups',
    method:'post'
    }
  ))
}
