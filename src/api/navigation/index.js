import request from '@/utils/request'


// 获取导航栏
export function getNavigation(data){
  return(request({
    url:"/portal/navigation/bsearch",
    method:'get',
    params:data
    }
  ))
}

export function addNavigation(data){
  return(request({
    url:'/portal/navigation/add',
    method:'post',
    data:data
  }))
}

export function updateNavigation(data){
  return(request({
    url:'/portal/navigation',
    method:'put',
    data:data
  }))
}

// 删除导航栏 （暂时还有问题）
export function delNavigation(data){
  return(request({
    url:"/portal/navigation/" + data,
    method:'delete',
    // params:data
  }))
}
