import request from "@/utils/request";

export function getPublishContent(data){
  return(request({
    url:'/portal/others/bsearchContent',
    method:'get',
    params:data
  }))
}

export function getPublishContentDetails(data){
  return(request({
    url:'/portal/others/show/'+ data,
    method:'get',
  }))
}

export function addPubishContentDetails(data){
  console.log(data)
  return(request({
    url:'/portal/others/addOthers',
    method:'post',
    data:data
  }))
}

export function delPublishContent(data){
  return(request({
    url:'/portal/others/deleteOthers/' + data,
    method:'delete',
  }))
}
export function updatePublishContent(data){
  return(request({
    url:'/portal/others',
    method:'put',
    data:data
  }))
}

export function changeIsShow(id,isshow){
  return(request({
    url:'/portal/others/editOthersPic/'+id+"/" + isshow,
    method:'put',
  }))
}
