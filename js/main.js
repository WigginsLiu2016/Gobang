//全局变量
var chessScore = new Array(15);//记录某一方在棋盘上空值的分数
var img_b = new Image();
img_b.src = "images/b.png";
var img_w = new Image();
img_w.src = "images/w.png";
var isWhite = true;//设置该局是否轮到白棋
var isWin = false;  //设置该局是否赢了
var canvas;//设置画布变量
var context;//为了获得页面的上下文
var chessData = new Array(15);//二维数组用来保存奇棋盘信息，初始化0为没有走过，1为白棋走的，2为黑棋走的
var p_step = 0;//记录电脑走的次数

//HTML文档加载完成后，初始化棋局
$(document).ready(function() {
	//初始化棋盘
	init();
});
function new_game(){
	document.location.reload();
}
//初始化
function init(){
	for (var i = 0; i < 15; i++) {
		chessData[i] = new Array(15);
		chessScore[i] = new Array(15);
        for (var j = 0; j < 15; j++) {
            chessData[i][j]=0;//棋盘的数据
			chessScore[i][j]=0;//保存空值的分数
        }
    }
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	for(var i = 0; i <= 640; i += 40) {
		//画横线
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(640, i);
		context.closePath();
		context.stroke();
		
		//画纵线
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, 640);
		context.closePath();
		context.stroke();
	}
}

//鼠标点击事件
function play(e){
	var canvasBC = document.getElementById('canvas');
	var x = parseInt((e.clientX-canvasBC.getBoundingClientRect().left-20)/40);//屏幕x坐标减去元素左侧坐标
	var y = parseInt((e.clientY-canvasBC.getBoundingClientRect().top-20)/40);
	if(chessData[x][y]!=0){
		
		return;
	}
	if(isWhite){
		isWhite = true;//一直让白棋主动下
		drawChess(1,x,y);
	}
	else {
		isWhite = true;
		drawChess(2,x,y);
	}
}

//绘制落子
function drawChess(chess, x, y){
	if(isWin === true){
		alert("游戏已经结束！");
		return;
	}
	if(x >= 0 && x < 15 && y >= 0&& y < 15){
		if(chess === 1){
			context.drawImage(img_w, x*40+20, y*40+20);//绘制白棋
			chessData[x][y] = 1;
			analysisValue(3-chess);//分析玩家每一步之后的棋盘形势
			if(p_step==0)
				AIdrawChess(x, y);
			else
				getBestLocation();//根据分析得到的分数表选择分数最大的地方落子
		}
		else {
			context.drawImage(img_b, x*40+20, y*40+20);//绘制黑棋
			chessData[x][y] = 2;
			chessScore[x][y]=0;//落子了之后将分数置0
		}
		judge(x,y,chess);
	}
}
//电脑分析落子
function AIdrawChess(x, y){
	var temp=0;
	var x1,y1;
	chessScore[x][y]=0;//得到确定的落子之后将该处的分数置0
	x1=x;
	y1=y;
	if(p_step == 0){//判断第一次
		
		while(true){//解决边缘越界的问题，我的算法好厉害0.0，不用一个边一个边的去判断
			temp = parseInt(Math.random()*8);
			if(temp == 1) {x1--;y1--;}
			else if(temp == 2) {y1--;}
			else if(temp == 3) {x1++;y1--;}
			else if(temp == 4) {x1++;}
			else if(temp == 5) {x1++;y1++;}
			else if(temp == 6) {y1++;}
			else if(temp == 7) {x1--;y1++;}
			else if(temp == 8) {x1--;}
			if(x1>=0&&y1>=0&&x1<15&&y1<15){
				x=x1;
				y=y1;
				break;
			} 
			x1=x;
			y1=y;
		}
		
		context.drawImage(img_b, x*40+20, y*40+20);//绘制黑棋
		chessData[x][y] = 2;
	}
	else{//非第一次
		context.drawImage(img_b, x*40+20, y*40+20);//绘制黑棋
		chessData[x][y] = 2;
	}
	p_step++;
	
}

//判断输赢
function judge(x,y,chess){
	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	var count4 = 0;
	//左右判断
	for(var i = x;i>=0;i--){
		if(chessData[i][y] != chess){
			break;
		}
		count1++;
	}
	for(var i = x+1;i < 15;i++){
		if(chessData[i][y] != chess){
			break;
		}
		count1++;
	}
	//上下判断
	for(var i = y;i>=0;i--){
		if(chessData[x][i] != chess){
			break;
		}
		count2++;
	}
	for(var i = y+1;i < 15;i++){
		if(chessData[x][i] != chess){
			break;
		}
		count2++;
	}
	//左上右下判断
	for(var i = x,j = y;i>=0, j >= 0;i--,j--){
		if(chessData[i][j] != chess){
			break;
		}
		count3++;
	}
	for(var i = x+1 ,j = y+1;i < 15, j < 15;i++,j++){
		if(chessData[i][j] != chess){
			break;
		}
		count3++;
	}
	//左下右上判断
	for(var i = x,j = y;i>=0, j < 15;i--,j++){
		if(chessData[i][j] != chess){
			break;
		}
		count4++;
	}
	for(var i = x+1 ,j = y-1;i < 15, j >= 0;i++,j--){
		if(chessData[i][j] != chess){
			break;
		}
		count4++;
	}
	
	if(count1 >= 5 || count2 >= 5 || count3 >= 5 || count4 >= 5){
		if(chess == 1){
			alert("恭喜白棋玩家！");
		}
		else {
			alert("恭喜黑棋玩家！");
		}
		isWin = true;//设置结局
	}
}

//打分函数
function analysisValue(chess){//对于本次来说，chess的传入参数为2，代表黑棋（电脑）
	var rowCount=0,leftDiagonalCount=0,rightDiagonalCount=0;//rowCount行，leftDiagonalCount左斜
															//rightDiagonalCount右斜
	var colCount=0;//colCount列数
	var rowClose=0,colClose=0,leftDiagonalClose=0,rightDiagonalClose=0;//是否封闭，0不封闭，1半封闭，2全封闭
	for(var i=0;i<15;i++)
		for(var j=0;j<15;j++){
			if(chessData[i][j] == 0){
				for(var rj=j-1;rj>=0;rj--){//分析空值的左边
					if(chessData[i][rj]==0)
						break;
					else if(chessData[i][rj]==chess)
						rowCount++;
					else if(chessData[i][rj]==(3-chess)){
						rowClose++;
						break;
					}
					
				}
				for(var rj=j+1;rj<15;rj++){//分析空值的右边
					if(chessData[i][rj]==0)
						break;
					else if(chessData[i][rj]==chess)
						rowCount++;
					else if(chessData[i][rj]==(3-chess)){
						rowClose++;
						break;
					}
				}
				for(var ci=i-1;ci>=0;ci--){//分析空值的正上边
					if(chessData[ci][j]==0)
						break;
					else if(chessData[ci][j]==chess)
						colCount++;
					else if(chessData[ci][j]==(3-chess)){
						colClose++;
						break;
					}
				}
				for(var ci=i+1;ci<15;ci++){//分析空值的正下边
					if(chessData[ci][j]==0)
						break;
					else if(chessData[ci][j]==chess)
						colCount++;
					else if(chessData[ci][j]==(3-chess)){
						colClose++;
						break;
					}
					
				}
				for(var ldi=i-1,ldj=j-1;ldi>=0&&ldj>=0;ldi--,ldj--){//左斜上半部分
					if(chessData[ldi][ldj]==0)
						break;
					else if(chessData[ldi][ldj]==chess)
						leftDiagonalCount++;
					else if(chessData[ldi][ldj]==(3-chess)){
						leftDiagonalClose++;
						break;
					}
				}
				for(var ldi=i+1,ldj=j+1;ldi<15&&ldj<150;ldi++,ldj++){//左斜下半部分
					if(chessData[ldi][ldj]==0)
						break;
					else if(chessData[ldi][ldj]==chess)
						leftDiagonalCount++;
					else if(chessData[ldi][ldj]==(3-chess)){
						leftDiagonalClose++;
						break;
					}
				}
				for(var rdi=i+1,rdj=j-1;rdi<15&&rdj>=0;rdi++,rdj--){//右斜上半部分
					if(chessData[rdi][rdj]==0)
						break;
					else if(chessData[rdi][rdj]==chess)
						rightDiagonalCount++;
					else if(chessData[rdi][rdj]==(3-chess)){
						rightDiagonalClose++;
						break;
					}
				}
				for(var rdi=i-1,rdj=j+1;rdi>=0&&rdj<15;rdi--,rdj++){//右斜下半部分
					if(chessData[rdi][rdj]==0)
						break;
					else if(chessData[rdi][rdj]==chess)
						rightDiagonalCount++;
					else if(chessData[rdi][rdj]==(3-chess)){
						rightDiagonalClose++;
						break;
					}
				}
			}
			else if(chessData[i][j] !=0)
				continue;
			//计数完成之后开始打分
			if(rowCount >=5 || colCount>=5 || leftDiagonalCount >=5 || rightDiagonalCount >=5)
				chessScore[i][j] += 100000;//成五
			else if((rowCount ==4 || colCount==4 || leftDiagonalCount ==4 || rightDiagonalCount ==4 )
					&& (rowClose == 0 || colClose == 0 || leftDiagonalClose ==0 || rightDiagonalClose ==0))
				chessScore[i][j] += 10000;//活四
			else if((rowCount ==4 || colCount==4 || leftDiagonalCount ==4 || rightDiagonalCount ==4 )
					&& (rowClose = 1 || colClose == 1 || leftDiagonalClose ==1 || rightDiagonalClose ==1))
				chessScore[i][j] += 1000;//死四
			else if((rowCount ==3 || colCount==3 || leftDiagonalCount ==3 || rightDiagonalCount ==3 )
					&& (rowClose == 0 || colClose == 0 || leftDiagonalClose ==0 || rightDiagonalClose ==0))
				chessScore[i][j] += 1000;//活三
			else if((rowCount ==3 || colCount==3 || leftDiagonalCount ==3 || rightDiagonalCount ==3 )
					&& (rowClose == 1 || colClose == 1 || leftDiagonalClose ==1 || rightDiagonalClose ==1))
				chessScore[i][j] += 100;//死三
			else if((rowCount ==2 || colCount==2 || leftDiagonalCount ==2 || rightDiagonalCount ==2 )
					&& (rowClose == 0 || colClose == 0 || leftDiagonalClose ==0 || rightDiagonalClose ==0))
				chessScore[i][j] += 100;//活二
			else if((rowCount ==2 || colCount==2 || leftDiagonalCount ==2 || rightDiagonalCount ==2 )
					&& (rowClose == 1 || colClose == 1 || leftDiagonalClose ==1 || rightDiagonalClose ==1))
				chessScore[i][j] += 10;//死二
			else if((rowCount ==1 || colCount==1 || leftDiagonalCount ==1 || rightDiagonalCount ==1 )
					&& (rowClose == 0 || colClose == 0 || leftDiagonalClose ==0 || rightDiagonalClose ==0))
				chessScore[i][j] += 10;//活一
			rowCount=0;leftDiagonalCount=0;rightDiagonalCount=0;colCount=0;
			rowClose=0,colClose=0,leftDiagonalClose=0,rightDiagonalClose=0;
		}
		
	
}

function getBestLocation(){
	var topScore=0;
	for(var i=0;i<15;i++)
		for(var j=0;j<15;j++){
			if(topScore<chessScore[i][j])
				topScore=chessScore[i][j];
		}
	for(var i=0;i<15;i++)
		for(var j=0;j<15;j++){
			if(topScore==chessScore[i][j]){//最大分数的落子
				AIdrawChess(i, j);
				judge(i,j,2);
				return;
			}
				
		}
}







