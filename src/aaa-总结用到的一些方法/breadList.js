如果将来想用这个框架那么记得处理路由带参数的传值，目前应该用session存值

breadItemClick(item){
  if(item.meta.noBreadClick){
    return
  }
  let indexValue = this.breadCrumbList.findIndex(it => {
    return it.name === item.name
  })
  let newBreadCrumbList  = this.breadCrumbList.slice(0,indexValue+1)
  sessionStorage.setItem("breadCrumbList",JSON.stringify(newBreadCrumbList))
  this.$router.push({
    path: item.path,
    query: item.query||{}
  });
},
beforeunloadHandler(){
  sessionStorage.setItem("breadCrumbList",JSON.stringify(this.breadCrumbList));
},

window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))




// 这里的方法是用来记住路由的query的---我们跟路由进行匹配，
import routes from "@/router/routes";
export const getBreadCrumbList = (route) => {
  // if(sessionStorage.getItem("breadCrumbList")){
  //   let breadCrumbList = JSON.parse(sessionStorage.getItem("breadCrumbList"));
  //   sessionStorage.removeItem("breadCrumbList");
  //   return breadCrumbList;
  // }
  let NameArr = [],
    index = 0,
    hasParentId = (function loop(routes, index) {
      return routes.some((item) => {
        if (item.name === route.name) {
          item.query = route.query;
          NameArr = NameArr.slice(0, index);
          NameArr.push(item);
          return true;
        } else if (Array.isArray(item.children)) {
          NameArr[index] = item;
          return loop(item.children, index + 1);
        } else {
          return false;
        }
      });
    })(routes, index);
  let breadCrumbList = JSON.parse(sessionStorage.getItem("breadCrumbList"));
  if(breadCrumbList&&breadCrumbList.length){
    NameArr.forEach( item => {
      breadCrumbList.forEach( it => {
        if(item.name === it.name){
          item.query = it.query
        }
      })
    })
  }
  sessionStorage.setItem("breadCrumbList",JSON.stringify(NameArr))
  return hasParentId ? NameArr : [];
};