import request from '@/utils/request'

export function getnavSubclass(data){
  return(request({
    url:"/portal/part/bsearch",
    method:'get',
    params:data
  }))
}

export function updateSubclass(data){
  return(request({
    url:"/portal/part/update",
    method:"put",
    data:data
  }))
}

export function addSubclass(data){
  return(request({
    url:'/portal/part/add',
    method:'post',
    data:data
  }))
}

export function delSubclass(data){
  return(request({
    url:'/portal/part/delete/' + data,
    method:'delete',
  }))
}

export function updateNavPubState(id,state){
  return request({
    url:'/portal/navigation/updateIsTop/' + id +'/' + state,
    method:'put'
  })
}
