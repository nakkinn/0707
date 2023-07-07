let graph = [
    [1,3,4],
    [0,2,5],
    [1,3,8],
    [0,2,4],
    [0,3,7,8],
    [1,6,7],
    [5,7,8],
    [4,5,6],
    [2,4,6]
];

let pos = [[600,100],[100,100],[100,600],[600,600],[,],[,],[,],[,],[,]];
let fix = [1,1,1,1,-1,-1,-1,-1,-1];

let pos2 = [[600,100],[100,100],[100,600],[600,600],[,],[,],[,],[,],[,]];

let mode = 0;
let sel = 0;

function setup(){
    createCanvas(windowWidth, windowHeight);

    for(let i=4; i<9; i++){
        pos2[i][0] = 350;
        pos2[i][1] = 350;
    }
    
}

function draw(){
    background(255);

    mat = new Array(5);
    for(let i=0; i<mat.length; i++) mat[i] = new Array(6);

    for(let k=0; k<2; k++){

        for(let i=0; i<mat.length; i++) for(let j=0; j<mat[i].length; j++)  mat[i][j] = 0;

        for(let i=4; i<=8; i++){
            mat[i-4][i-4] = graph[i].length;
            for(let j=0; j<graph[i].length; j++){
                if(fix[graph[i][j]]==1){
                    mat[i-4][5] += pos[graph[i][j]][k];
                }else{
                    mat[i-4][graph[i][j]-4] = -1;
                }
            }
        }

        let tmp = hakidashi(mat);

        for(let i=0; i<tmp.length; i++){
            pos[i+4][k] = tmp[i];
        }

    }

    for(let i=4; i<9; i++){
        let tmpx = 0, tmpy = 0;
        for(let j=0; j<graph[i].length; j++){
            tmpx += pos[graph[i][j]][0]/graph[i].length;
            tmpy += pos[graph[i][j]][1]/graph[i].length;
        }
        pos2[i][0] += (tmpx - pos2[i][0])*0.1;
        pos2[i][1] += (tmpy - pos2[i][1])*0.1;
    }


    noStroke();
    fill(255,0,0);
    for(let i=0; i<pos.length; i++){
        if(i>=4)    fill(0);
        circle(pos[i][0], pos[i][1], 20);
    }

    fill(0,255,0);
    for(let i=4; i<9; i++){
        circle(pos2[i][0], pos2[i][1], 20);
    }

    stroke(0);
    for(let i=0; i<graph.length; i++){
        for(let j=0; j<graph[i].length; j++){
            line(pos[i][0], pos[i][1], pos[graph[i][j]][0], pos[graph[i][j]][1]);
        }
    }

    

    if(mode == 1){
        pos[sel][0] = mouseX;
        pos[sel][1] = mouseY;
    }
}

function mousePressed(){
    for(let i=0; i<4; i++){
        if(dist(mouseX, mouseY, pos[i][0], pos[i][1])< 20){
            sel = i;
            mode = 1;
            break;
        }
    }
}

function mouseReleased(){
    mode = 0;
}

function hakidashi(mat){
    let mcopy = new Array(mat.length);
    for(let i=0; i<mcopy.length; i++)   mcopy[i] = mat[i].concat();

    let gyou = mat.length;
    let retu = mat[0].length;

    let g = 0, r = 0, tmp, flag;

    for(let k=0; k<mat.length; k++){

        flag = false;
    
        if(mat[g][r]==0){
            flag = true;
            for(let i=g+1; i<gyou; i++){
                if(mat[i][r]!=0){
                    tmp = mat[g].concat();
                    mcopy[g] = mcopy[i].concat();
                    mcopy[i] = tmp.concat();
                    flag = false;
                    break;
                }
            }
        }

        if(!flag){

            tmp = mcopy[g][r];
            for(let i=0; i<retu; i++)   mcopy[g][i] /= tmp;
            for(let i=0; i<gyou; i++)   if(i != g){
                tmp = mcopy[i][r];
                for(let j=0; j<retu; j++)   mcopy[i][j] -= tmp*mcopy[g][j];
            }
            g++;
        }
        r++;
    }
    
    let result = new Array(mcopy.length);
    for(let i=0; i<mcopy.length; i++)   result[i] = mcopy[i][mcopy[i].length-1];

    return result;
}
