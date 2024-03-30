let board=new Array(17);
for(let i=0;i<17;i++)   board[i]=new Array(17);
for(let i=0;i<17;i++)   for(let j=0;j<17;j++)   board[i][j]=0;
let maze=new Array(9);
for(let i=0;i<9;i++)    maze[i]=new Array(9);
for(let i=0;i<9;i++)    for(let j=0;j<9;j++)    maze[i][j]=0;
let ts=53,rs=11,px=0,py=20,col=['#3a57fd','#f14434','#20992a','#000000'];
let x1=0,x2=0,y1=0,y2=0,start=0,turn=0,pos=[[0,0],[0,16]],wall=[10,10];

function disableScroll(event) { //スマホの縦スクロールを制限
    event.preventDefault();
}
document.addEventListener('touchmove', disableScroll, { passive: false });

function setup(){
    createCanvas(windowWidth,windowHeight);
    px=(width-height)/2;
    
    frameRate(30);

    for(let i=2;i<16;i+=2){
        board[i][0]=9;
        board[i][16]=9;
    }

}

function draw(){
    background(255);

    noStroke();
    for(let i=0;i<17;i++)   for(let j=0;j<17;j++){
        if(board[i][j]>=1&&board[i][j]<=4)  fill(col[board[i][j]-1]);
        else    if(board[i][j]==9)    fill('#ffaa55');
        else    if(i%2==0&&j%2==0)    fill(220);
        else    noFill();
        rect(ts*int((i+1)/2)+rs*int(i/2)+px,ts*int((j+1)/2)+rs*int(j/2)+py,(i%2)*rs+((i+1)%2)*ts,(j%2)*rs+((j+1)%2)*ts);
        if(board[i][j]>=5&&board[i][j]<=8){
            fill(col[board[i][j]-5]);
            fill(col[board[i][j]-5]);
            circle(ts*int((i+1)/2)+rs*int(i/2)+ts/2+px,ts*int((j+1)/2)+rs*int(j/2)+ts/2+py,ts*0.7);
        }
    }
    
    for(let i=0;i<10;i++){
        fill(col[0]);
        if(i<wall[0])   r=12;
        else    r=4;
        circle(px+(9-i)*ts+45,py/2,r);
        fill(col[1]);
        if(i<wall[1])   r=12;
        else    r=4;
        circle(px+i*ts+45,py+(ts+rs)*9,r);
    }

}

function mousePressed(){
    x1=mouseX;
    y1=mouseY;
}

function mouseReleased(){
    let c,r,len;
    x2=mouseX;
    y2=mouseY;

    len=dist(x1,y1,x2,y2)/(ts+rs);
    if(len>0.5&&len<2.5&&wall[turn]>0&&start>1){

        c=Math.round(((x1+x2)/2-px)/(ts+rs));
        r=Math.round(((y1+y2)/2-py)/(ts+rs));
        
        if(c>0&&c<9&&r>0&&r<9){
            if(abs(x2-x1)/abs(y2-y1)>5){
                if(board[2*c-1][r*2-1]==0&&board[2*c][r*2-1]==0&&board[2*c-2][r*2-1]==0){
                    board[2*c-1][r*2-1]=turn+1;
                    board[2*c][r*2-1]=turn+1;
                    board[2*c-2][r*2-1]=turn+1;
                    if(enable2()){
                        wall[turn]--;
                        turn=(turn+1)%2;
                        enable();
                    }else{
                        board[2*c-1][r*2-1]=0;
                        board[2*c][r*2-1]=0;
                        board[2*c-2][r*2-1]=0;
                    }

                }
            }
            if(abs(x2-x1)/abs(y2-y1)<0.2){
                if(board[2*c-1][r*2-1]==0&&board[2*c-1][r*2]==0&&board[2*c-1][r*2-2]==0){
                    board[2*c-1][r*2-1]=turn+1;
                    board[2*c-1][r*2]=turn+1;
                    board[2*c-1][r*2-2]=turn+1;
                    if(enable2()){
                        wall[turn]--;
                        turn=(turn+1)%2;
                        enable();
                    }else{
                        board[2*c-1][r*2-1]=0;
                        board[2*c-1][r*2]=0;
                        board[2*c-1][r*2-2]=0; 
                    }
                }
            }
        }

    }

    if(len<0.1){
        if(((x2-px)/(ts+rs))%1<0.8&&((y2-py)/(ts+rs))%1<0.8){
            c=int((x2-px)/(ts+rs)),r=int((y2-py)/(ts+rs));
            if(c>=0&&r>=0&&c<9&&r<9){
                c*=2;
                r*=2;
                if(board[c][r]==9){
                    if(start>1){
                        board[pos[turn][0]][pos[turn][1]]=0;
                        board[c][r]=5+turn;
                        pos[turn][0]=c;
                        pos[turn][1]=r;
                        turn=(turn+1)%2;
                    }else{
                        if(r==0){
                            turn=0;
                            for(let i=2;i<16;i+=2)  if(i!=c)  board[i][0]=0;  
                        }
                        else{
                            turn=1;
                            for(let i=2;i<16;i+=2)  if(i!=c)  board[i][16]=0; 
                        }
                        start++;
                        board[c][r]=5+turn;
                        pos[turn][0]=c;
                        pos[turn][1]=r;
                        if(start==2)    turn=(turn+1)%2;
                    }

                    if(start>1) enable();
                }
            }
        }
    }
}

function enable2(){
    let result=[false,false];
    let d=[[0,-1],[1,0],[0,1],[-1,0]];

    for(let player=0;player<2;player++){

        for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
            maze[i][j]=0;
        }
        maze[pos[player][0]/2][pos[player][1]/2]=1;

        let flag=false;
        for(let loop=0;loop<80;loop++){
            for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
                for(let k=0;k<4;k++){
                    if(ins(i*2+d[k][0]*2,j*2+d[k][1]*2)){
                        if(maze[i][j]==0&&maze[i+d[k][0]][j+d[k][1]]==1&&board[i*2+d[k][0]][j*2+d[k][1]]==0){
                            maze[i][j]=1;
                            flag=true;
                            if(j==8-player*8){
                                loop=80;
                                result[player]=true;
                            }
                            i=9,j=9,k=4;
                        }
                    }
                }
                if(i==8&&j==8)  loop=80;
            }
        }
    }

    if(result[0]&&result[1])    return true;
    else    return false;
}

function enable(){
    let c,r;
    let d=[[0,-1],[1,0],[0,1],[-1,0]];

    c=pos[turn][0];
    r=pos[turn][1];

    for(let i=0;i<17;i++)   for(let j=0;j<17;j++)   if(board[i][j]==9)  board[i][j]=0;
    for(let i=0;i<4;i++){
        if(ins(c+d[i][0],r+d[i][1])){
            if(board[c+d[i][0]][r+d[i][1]]==0){
                if(board[c+d[i][0]*2][r+d[i][1]*2]==0)  board[c+d[i][0]*2][r+d[i][1]*2]=9;
                else{
                    if(ins(c+d[i][0]*3,r+d[i][1]*3)){
                        if(board[c+d[i][0]*3][r+d[i][1]*3]==0&&board[c+d[i][0]*4][r+d[i][1]*4]==0)  board[c+d[i][0]*4][r+d[i][1]*4]=9;
                        else    if(board[c+d[i][0]*3][r+d[i][1]*3]!=0){
                            let cc=c+d[i][0]*2,rr=r+d[i][1]*2;
                            for(let j=0;j<4;j++){
                                if(ins(cc+d[j][0],rr+d[j][1])){
                                    if(board[cc+d[j][0]][rr+d[j][1]]==0&&board[cc+d[j][0]*2][rr+d[j][1]*2]==0)
                                        board[cc+d[j][0]*2][rr+d[j][1]*2]=9;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}

function ins(cc,rr){
    if(cc>=0&&cc<17&&rr>=0&&rr<17)  return true;
    else    return false;
}
