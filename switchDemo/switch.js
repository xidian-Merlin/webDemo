var obj = {
    t: document.getElementById("layoutTarget"),
    h: document.getElementById("layoutH"),
    v: document.getElementById("layoutV")
};
obj.h.onclick = function(){
    //判断当前布局
    if(this.className === "cl on"){
        //当前非此布局，进行切换
        obj.t.className = "layout";
        this.className = "cl";
        obj.v.className = "cl on";
    }
    return false;
};
obj.v.onclick = function(){
    //判断当前布局
    if(this.className === "cl on"){
        //当前非此布局，进行切换
        obj.t.className = "layout newview";
        this.className = "cl";
        obj.h.className = "cl on";
    }
    return false;
};