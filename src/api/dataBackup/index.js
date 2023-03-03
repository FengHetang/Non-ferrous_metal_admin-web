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
    url:'/portal/backups/download/'+data,
    method:'post',
    responseType: 'arraybuffer',
    timeout:100 * 1000
  }))
}

export function delData(data){
  return(request({
    url:'/portal/backups/' + data,
    method:'delete',
  }))
}

export function backupData(){
  return(request({
    url:'/portal/backups',
    method:'post'
    }
  ))
}
