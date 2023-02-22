import request from "@/utils/request";

export function getPublishContent(data){
  return(request({
    url:'/portal/others/bsearchContent',
    method:'get',
    data:data
  }))
}

export function getPublishContentDetails(data){
  console.log(data)
  return(request({
    url:'/portal/others/show',
    method:'get',
    params:data
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
    url:'/portal/others/deleteOthers',
    method:'post',
    params:data
  }))
}
export function updatePublishContent(data){
  return(request({
    url:'/portal/others',
    method:'put',
    data:data
  }))
}

export function changeIsShow(data){
  return(request({
    url:'/portal/others/editOthersPic',
    method:'post',
    params:data
  }))
}
