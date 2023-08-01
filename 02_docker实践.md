# 02_docker安装部署

# 1.国内源安装docker-ce

## 1.1 配置linux内核流量转发功能

![1661828162302](pic/1661828162302.png)



```
因为docker和宿主机的端口映射，本质是内核的流量转发功能
## 若未配置，需要执行如下

$ cat <<EOF >  /etc/sysctl.d/docker.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward=1
EOF

# 加载内核防火墙模块，允许流量转发
# 加载内核防火墙功能参数1
[root@docker-01 ~]#modprobe br_netfilter
[root@docker-01 ~]#

#  确认有记录，就是开启了这个流量转发功能
[root@docker-01 ~]#lsmod|grep netfilter
br_netfilter           22256  0 
bridge                146976  1 br_netfilter
[root@docker-01 ~]#


# nginx优化参数
#对内核tcp参数优化
# 增加默认tcp链接数等参数修改

[root@docker-01 ~]#sysctl -p /etc/sysctl.d/docker.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1  # iptables的forward转发功能就没用了





```









## 配置清华、阿里源皆可

### 清华的

```
# 基础环境配置
yum remove docker docker-common docker-selinux docker-engine
yum install yum-utils device-mapper-persistent-data lvm2




# 2
wget -O /etc/yum.repos.d/docker-ce.repo https://download.docker.com/linux/centos/docker-ce.repo
# 3
sed -i 's#download.docker.com#mirrors.tuna.tsinghua.edu.cn/docker-ce#g'  /etc/yum.repos.d/docker-ce.repo
# 4
yum makecache fast

# 5
# 安装docker-ce  社区版，免费版 docker
yum install docker-ce -y
# 6
# 启动
systemctl start docker
# 7
# 查看docker服务端进程

ps -ef|grep docker 

# 7.1 检查docker版本
[root@docker-01 ~]#docker version
Client: Docker Engine - Community
 Version:           20.10.17
 API version:       1.41
 Go version:        go1.17.11
 Git commit:        100c701
 Built:             Mon Jun  6 23:05:12 2022
 OS/Arch:           linux/amd64
 Context:           default
 Experimental:      true

Server: Docker Engine - Community
 Engine:
  Version:          20.10.17
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.17.11
  Git commit:       a89b842
  Built:            Mon Jun  6 23:03:33 2022
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.8
  GitCommit:        9cd3357b7fd7218e4aec3eae239db1f68a5a6ec6
 runc:
  Version:          1.1.4
  GitCommit:        v1.1.4-0-g5fd4c4d
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0







# 8 
# 默认
docker pull  dockerhub 国外站点下载， 太慢

https://hub.docker.com/  #注册，然后，就会有账号密码，里面管理你自己的私有镜像。
由于是国外，太慢，配置加速器，常见方案有

# 方案1，执行如下脚本即可
curl -sSL https://get.daocloud.io/daotools/set_mirror.sh | sh -s http://f1361db2.m.daocloud.io
========================================================================

# 方案2，用你自己的 阿里云镜像加速器
https://cr.console.aliyun.com/cn-beijing/instances/mirrors


sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://ms9glx6x.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker





# 配置docker镜像下载加速器（去获取你自己的阿里云镜像站，别用别人的）
# 常见玩法

[root@docker-01 ~]#
[root@docker-01 ~]#cat /etc/docker/daemon.json 
{
  "registry-mirrors": ["https://ms9glx6x.mirror.aliyuncs.com"]
}
[root@docker-01 ~]#




```

![1661829073546](pic/1661829073546.png)



### 阿里的





## Docker 服务端版本







## -----启动第一个容器-----

![1661829375219](pic/1661829375219.png)

```
# 启动一个nginx测试

# 容器，镜像的关系 

# 镜像（）



# 初体验容器的 三部曲操作

1.  搜索官网镜像

docker search  镜像名:镜像版本    # 语法

docker search nginx  # 默认最新版本 nginx:latest


2. 下载官网镜像
docker pull nginx 

语法
# docker  pull 镜像名:tag  版本

docker  pull  nginx:latest 
# 下载过程，你会发现，拆开，一层一层下载的？为什么？镜像原理，分层原理


[root@docker-01 ~]#docker pull nginx 
Using default tag: latest
latest: Pulling from library/nginx
a2abf6c4d29d: Pull complete 
a9edb18cadd1: Pull complete 
589b7251471a: Pull complete 
186b1aaa4aa6: Pull complete 
b4df32aa5a72: Pull complete 
a0bcbecc962e: Pull complete 
Digest: sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
[root@docker-01 ~]#




3. 运行官网镜像
# 端口映射，你才能访问到容器内的东西
# -p 28877:80   将宿主机的28877流量转发给容器内目标端口  80端口
# -d 后台运行docker实例进程，不加试试

docker run -d   -p 28877:80      nginx


4. 运行容器后，会发挥当前创建的一个容器id记录号，你可以去管理它
[root@docker-01 ~]#docker run -d   -p 28877:80      nginx
f7bffe1c1854ec3c6c3c1d64a22d97a69414e07b5774bf44da494c219e231085
[root@docker-01 ~]#


5.查看运行的容器进程列表

docker ps 
```



下载官网认证的镜像，是最安全的，留个后门



![1661829530579](pic/1661829530579.png)

## 分析容器进程查看

![1661829890048](pic/1661829890048.png)





## 理解docker网络流量走向

![1661830154498](pic/1661830154498.png)



看到结果

![1661830178874](pic/1661830178874.png)



## 查看这个运行中的容器进程，创建了些什么

```perl
检查这个nginx 容器进程的信息 

[root@docker-01 ~]#docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                                     NAMES
f7bffe1c1854   nginx     "/docker-entrypoint.…"   20 minutes ago   Up 20 minutes   0.0.0.0:28877->80/tcp, :::28877->80/tcp   keen_kirch


容器进程，说白了，宿主机上的一个进程（被docker进程所管理的程序）


[root@docker-200 ~]#ps -ef|grep 13916

# 这段信息，证明，容器进程，创建了容器的信息，以及名称空间，以及网络空间等
/usr/bin/containerd-shim-runc-v2
-namespace moby
-id f7bffe1c1854ec3c6c3c1d64a22d97a69414e07b5774bf44da494c219e231085
f7bffe1c1854
-address 


root      13916      1  0 11:22 ?        00:00:00 /usr/bin/containerd-shim-runc-v2 -namespace moby -id f7bffe1c1854ec3c6c3c1d64a22d97a69414e07b5774bf44da494c219e231085 -address /run/containerd/containerd.sock



root      13934  13916  0 11:22 ?        00:00:00 nginx: master process nginx -g daemon off;
root      15180  15122  0 11:45 pts/0    00:00:00 grep --color=auto 13916
[root@docker-200 ~]#

# 停止容器进程试试
[root@docker-200 ~]#docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                                     NAMES
f7bffe1c1854   nginx     "/docker-entrypoint.…"   24 minutes ago   Up 24 minutes   0.0.0.0:28877->80/tcp, :::28877->80/tcp   keen_kirch
[root@docker-200 ~]#

# 你可以直接基于 容器id，完整，或者最少3位，或者容器名去管理
[root@docker-200 ~]#docker stop f7b  
# 三选一都行
docker stop f7b  f7bffe1c1854  keen_kirch   # 3333





[root@docker-200 ~]#docker stop f7b
f7b
[root@docker-200 ~]#
[root@docker-200 ~]#
# docker ps查看运行中的容器记录
[root@docker-200 ~]#docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
[root@docker-200 ~]#

# docker 容器挂掉后，数据会丢失吗？（这个容器记录是否还在，是否被删除）
#答案： 不会丢，具体要看 docker ps -a 是否还能查询到该容器记录


#查看所有的容器记录，详细信息
[root@docker-200 ~]#docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
[root@docker-200 ~]#
[root@docker-200 ~]#
[root@docker-200 ~]#docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                      PORTS     NAMES
f7bffe1c1854   nginx     "/docker-entrypoint.…"   26 minutes ago   Exited (0) 57 seconds ago             keen_kirch
dc597976c0a9   nginx     "/docker-entrypoint.…"   27 minutes ago   Exited (0) 27 minutes ago             romantic_albattani
[root@docker-200 ~]#
[root@docker-200 ~]#


# 再次启动该容器记录



```



![1661831439120](pic/1661831439120.png)





![1661831642927](pic/1661831642927.png)





# 2.初体验docker玩法

## 镜像命令

### 搜索镜像

```
docker search 镜像名
docker search redis

docker search wordpress


# docker jumpserver 官网，是否支持docker部署
# 下载jumpserver官网提供最新的 部署脚本

1. 下载所有组件的docker镜像
2. 修改配置文件，每一个组件的运行地址信息
3. 启动

[root@docker-200 /opt]#wget https://github.com/jumpserver/jumpserver/releases/download/v2.25.2/quick_start.sh



搜索一个ubuntu系统
[root@docker-200 /opt]#docker search ubuntu



```



### 下载镜像

```

docker pull redis
docker pull redis:latest     # redis（依赖于基础镜像,来自于xx镜像，。centso，ubuntu，suse，其他xxx ，具体要进入这个容器的命名空间，去看看）

docker pull ubuntu
docker pull ubuntu:latest  # 下载一个ubuntu系统发行版 ，纯净系统+  宿主机的内核，运行，可使用ubuntu环境

docker pull wordpress
docker pull wordpress:latest （同上）

完全听懂1111


```



## 镜像分层原理，实际效果

![1661832566515](pic/1661832566515.png)





### 查看镜像列表

![1661832733692](pic/1661832733692.png)

```
docker  image ls 
docker   images

# 根据名字查看
docker images centos*


```



## 关于镜像分层存储，实现的镜像优化，多阶段构建。



![1661833148292](pic/1661833148292.png)

### 获取docker hub 可用镜像版本

```

# 基于http接口，访问docker hub的官网仓库API，获取json数据结果
 # 查询centos镜像版本
curl -s https://registry.hub.docker.com/v1/repositories/centos/tags  |   jq

# 领导让你 基于mysql5.7 部署个镜像

curl -s https://registry.hub.docker.com/v1/repositories/mysql/tags  |   jq



```



## 下载一些可用版本

```
[root@docker-200 /opt]#docker pull mysql:5.7.25

[root@docker-200 /opt]#docker pull mysql:5.7.7

# 查看镜像列表

[root@docker-200 /opt]#docker images
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
nginx        latest    605c77e624dd   8 months ago    141MB
redis        latest    7614ae9453d1   8 months ago    113MB
ubuntu       latest    ba6acccedd29   10 months ago   72.8MB
mysql        5.7.25    98455b9624a9   3 years ago     372MB
mysql        5.7.7     cf8a22028fe7   7 years ago     322MB
[root@docker-200 /opt]#
[root@docker-200 /opt]#


```



## docker history命令看看镜像最后一个命令是干啥

````
[root@docker-200 /opt]#docker history nginx:1.19.7 
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
35c43ace9216   18 months ago   /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B        
<missing>      18 months ago   /bin/sh -c #(nop)  STOPSIGNAL SIGQUIT           0B        
<missing>      18 months ago   /bin/sh -c #(nop)  EXPOSE 80                    0B        
<missing>      18 months ago   /bin/sh -c #(nop)  ENTRYPOINT ["/docker-entr…   0B        
<missing>      18 months ago   /bin/sh -c #(nop) COPY file:c7f3907578be6851…   4.62kB    
<missing>      18 months ago   /bin/sh -c #(nop) COPY file:0fd5fca330dcd6a7…   1.04kB    
<missing>      18 months ago   /bin/sh -c #(nop) COPY file:0b866ff3fc1ef5b0…   1.96kB    
<missing>      18 months ago   /bin/sh -c #(nop) COPY file:65504f71f5855ca0…   1.2kB     
<missing>      18 months ago   /bin/sh -c set -x     && addgroup --system -…   63.8MB    
<missing>      18 months ago   /bin/sh -c #(nop)  ENV PKG_RELEASE=1~buster     0B        
<missing>      18 months ago   /bin/sh -c #(nop)  ENV NJS_VERSION=0.5.1        0B        
<missing>      18 months ago   /bin/sh -c #(nop)  ENV NGINX_VERSION=1.19.7     0B        
<missing>      18 months ago   /bin/sh -c #(nop)  LABEL maintainer=NGINX Do…   0B        
<missing>      18 months ago   /bin/sh -c #(nop)  CMD ["bash"]                 0B        
<missing>      18 months ago   /bin/sh -c #(nop) ADD file:d5c41bfaf15180481…   69.2MB    
[root@docker-200 /opt]#

````



### 运行镜像，生成容器（nginx 1.19.7 容器，web服务）

```

[root@docker-200 /opt]#docker pull  nginx:1.19.7



1. 本地运行模式（同一个docker0下的容器，都可以互相访问
），nginx只在容器内的网络空间运行，不对外，（docker run 别加端口映射参数

docker run nginx:1.19.7 # 前台运行，日志打印再前台，

docker run  -d  nginx:1.19.7 # 后台运行docker进程

2. 制定容器的运行名字，以及看看，基于一个镜像，可以运行N个容器进程
# 运行多个容器
[root@docker-200 /opt]#docker run -d nginx:1.19.7 
748dd6a07899d00ee5b5d78efc75f68ee579239893ca2073d6cef82d7cfacf92
[root@docker-200 /opt]#docker run -d nginx:1.19.7 
57c44737db103327bcc3008d0da8b2fe3f87b52bd4e642c05c657b14b9ee0064
[root@docker-200 /opt]#docker run -d nginx:1.19.7 


#  --name玩法，制定名字，不能冲突
[root@docker-200 /opt]#docker run --name php_nginx  -d nginx:latest 

# [root@docker-200 /opt]##这些容器，的ip，默认都是 172.17.0.1 这个网段的。看懂1111
[root@docker-200 /opt]#

# 查看容器ip，宿主机是可以和这个容器通信的（非docker宿主机不行）

# 查看容器详细信息，输出为json结果的命令

[root@docker-200 /opt]#docker inspect php_nginx （容器名字）
[root@docker-200 /opt]#docker inspect php_nginx |grep -i IPAddress
            "SecondaryIPAddresses": null,
            "IPAddress": "172.17.0.14",
                    "IPAddress": "172.17.0.14",
[root@docker-200 /opt]#



========================================================================
# 宿主机访问，通过docker0 访问本地容器的nginx
[root@docker-200 /opt]#curl -I 172.17.0.14:80     # 看到的nginx版本应该是多少？请发弹幕 1.21
HTTP/1.1 200 OK
Server: nginx/1.21.5
Date: Tue, 30 Aug 2022 04:35:55 GMT
Content-Type: text/html
Content-Length: 615
Last-Modified: Tue, 28 Dec 2021 15:28:38 GMT
Connection: keep-alive
ETag: "61cb2d26-267"
Accept-Ranges: bytes

[root@docker-200 /opt]#
[root@docker-200 /opt]## 看懂 7777
[root@docker-200 /opt]#


========================================================================
查看jumpserver_nginx这个容器的nginx版本



2. 对外运行模式
对外运行一个 1.19.7的nginx  ，直接访问宿主机的 80就看到 1.19.7de nginx


[root@docker-200 /opt]#docker run -d -p 80:80  nginx:1.19.7
cb786a879e79a313565597f7a7ea941d5dfbc5c9c4d3c2092b24c30afc1689c0


下午 2.40 上课。




```

![1661833955076](pic/1661833955076.png)



![1661834322439](pic/1661834322439.png)





## ---下午开始----运行镜像，生成容器（ubuntu容器）-----

```perl

容器，下载多个发行版的环境（base image，基础环境）

xx电商程序 （centos7.9  / ubuntu 16  /  suse / ）

没有容器该怎么办？ 电商程序centos7.9        jumpserver堡垒机，ubuntu 16   
1.准备基础环境，kvm，vmware，虚拟化，(1.下载对应镜像 4G.iso，内核+发行版，       ubuntu.iso)
2. 分别部署程序运行的依赖环境 
- 电商程序 centos7.9  ,lnmp
	- centos7.9  
	
		- 几十兆
        - yum install nginx php-fpm mysql 
        - sed 配置修改
        - 启动各个程序


 jumpserver堡垒机，ubuntu 16  
 一样
 


有了容器，方便吗？
1. 获取基础镜像 docker pull centos:7.9.x （只有发行版）
2. 




1. 获取基础镜像  docker pull  ubuntu:latest  （只有发行版） 
2. 进入一个ubuntu的环境，去部署xxx

# 新参数
# docker run 的参数
# -t 开启一个中断
-t, --tty                            Allocate a pseudo-TTY
# 标准输入，给容器输入些东西
-i, --interactive                    Keep STDIN open even if not attached

# 进入ubuntu容器空间内

# 如何判断你容器内，还是宿主机的呢？（容器创建的名称，网络，进程，文件系统，用户）
# 44444444444

# 看ip     看hostname  网络    network namespace     
# 看进程     进程pid namespace     ps -ef| wc -l
#  命令提示符  看boot目录   file system namespace     ， cat /etc/os-release  



root@docker-200 /opt]#docker run -i -t  ubuntu:latest /bin/bash
root@cc1f58f0e1c0:/# 
root@cc1f58f0e1c0:/# 
root@cc1f58f0e1c0:/#            
root@cc1f58f0e1c0:/# 
root@cc1f58f0e1c0:/# 
# 查看ubuntu系统信息

root@cc1f58f0e1c0:/# cat /etc/os-release 
NAME="Ubuntu"
VERSION="20.04.3 LTS (Focal Fossa)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 20.04.3 LTS"



```



## 进入一个centos7.9的环境

```
查询具体7.9版本号

yum install jq -y

curl -s https://registry.hub.docker.com/v1/repositories/centos/tags  |   jq

# docker hub 提供了这个版本给你用
[root@docker-200 ~]#curl -s https://registry.hub.docker.com/v1/repositories/centos/tags  | jq |grep 7.9
    "name": "7.9.2009"
    "name": "centos7.9.2009"
[root@docker-200 ~]#


docker pull centos:7.9.2009


# 再下一个 centos7.4.1708


[root@docker-200 ~]#docker images centos*
REPOSITORY   TAG        IMAGE ID       CREATED         SIZE
centos       7.9.2009   eeb6ee3f44bd   11 months ago   204MB
centos       7.4.1708   9f266d35e02c   3 years ago     197MB



```



## 部署多个linux发行版环境



![1661845077237](pic/1661845077237.png)



```
1.如上，就进入了4个不同的容器空间，分别是以 centos，ubuntu为基础镜像的环境


2. 然后可以自由定制容器内的资源，这种操作的目的在于，提交容器，生成新的镜像。自定制镜像





```

## -------自定制一个docker镜像---------

docker commit命令

![1661849516790](pic/1661849516790.png)



```
1. docker hub 下载一个centos7.4.1708  最小化的系统，基础镜像

2. 再此基础环境上，部署新的，你需要的环境,，提供了网络工具包，net-tools ,vim,nginx
也测试了容器内，可以运行具体的nginx程序，以及可以访问

2.1 提交容器记录，生成新的镜像记录
[root@docker-200 ~]#docker commit 678753a1373c  yuchao163/0224-vim-net-tools-nginx-centos7

2.2 查看新的镜像记录
[root@docker-200 ~]#docker images yuchao163/0224-*
REPOSITORY                                   TAG       IMAGE ID       CREATED          SIZE
yuchao163/0224-vim-net-tools-nginx-centos7   latest    3a152c4459a1   15 seconds ago   504MB
yuchao163/0224-hello-docker                  latest    feb5d9fea6a5   11 months ago    13.3kB
[root@docker-200 ~]#


2.3 基于这个新的自定义镜像，去运行nginx程序。

[root@docker-200 ~]## 我要基于这个镜像，运行一个nginx，可以吗？
[root@docker-200 ~]#
[root@docker-200 ~]## 我要基于这个镜像，运行一个nginx，可以吗？ 

===================================================================
方式1，先进入这个容器，再前台启动nginx，

[root@docker-200 ~]#docker run -it  yuchao163/0224-vim-net-tools-nginx-centos7  bash

前台运行nginx的启动方式
[root@c8200dad0ecb /]# nginx -g "daemon off;"
 

2.4 进入一个运行中的容器空间内
# 进入容器内，且执行bash，开启bash交互式环境
# 看懂7777

docker exec -it 容器id记录  bash

[root@c8200dad0ecb /]# ifconfig eth0
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.2  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:ac:11:00:02  txqueuelen 0  (Ethernet)
        RX packets 8  bytes 648 (648.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@c8200dad0ecb /]# 



===================================================================

方式2，直接启动nginx，直接再宿主机上，运行一个 nginx容器进程。
# 模拟官网提供的 nginx镜像，是如何提供可运行的nginx程序的
# 
[root@docker-200 ~]#
[root@docker-200 ~]#

[root@docker-200 ~]#docker run -d -p 80:80  yuchao163/0224-vim-net-tools-nginx-centos7 nginx -g "daemon off;"
1207ab2e3ac5f84ce732004dcc56e5ffb955f310ccea2f9dc1e3d508140d5de6
[root@docker-200 ~]#
[root@docker-200 ~]#docker ps
CONTAINER ID   IMAGE                                        COMMAND                  CREATED         STATUS        PORTS                               NAMES
1207ab2e3ac5   yuchao163/0224-vim-net-tools-nginx-centos7   "nginx -g 'daemon of…"   2 seconds ago   Up 1 second   0.0.0.0:80->80/tcp, :::80->80/tcp   boring_herschel
[root@docker-200 ~]#

# 查看自定义镜像，运行后的容器内容，以及端口映射的结果

[root@docker-200 ~]#curl 10.0.0.200:80
good good study 
day day up
[root@docker-200 ~]#

===========================================================================
构建了一个镜像，可以发布给多个环境，都看到 day day up

再本地运行多次
# -p 端口映射是  宿主机端口:容器内暴露的端口 
# -P  随机给宿主机暴露一个端口，且要求，容器默认声明自己，打开了什么端口
# 我们目前自定义的镜像，只能主动  -p 映射容器内的80端口

  338  docker run -d -p 81:80 yuchao163/0224-vim-net-tools-nginx-centos7 nginx -g "daemon off;"
  339  docker run -d -p 82:80 yuchao163/0224-vim-net-tools-nginx-centos7 nginx -g "daemon off;"
  340  docker run -d -p 83:80 yuchao163/0224-vim-net-tools-nginx-centos7 nginx -g "daemon off;"
  341  docker run -d -p 84:80 yuchao163/0224-vim-net-tools-nginx-centos7 nginx -g "daemon off;"






===========================
- 1.提交到镜像仓库



=================================================================================
- 2. 本地导出
[root@docker-200 ~]#docker save yuchao163/0224-vim-net-tools-nginx-centos7  > /opt/0224-vim-net-tools-nginx-centos7.tar 
[root@docker-200 ~]#
[root@docker-200 ~]#
[root@docker-200 ~]#du -h /opt/0224-vim-net-tools-nginx-centos7.tar 
492M	/opt/0224-vim-net-tools-nginx-centos7.tar
[root@docker-200 ~]#
=================================================================================
3. 发给目标机器 docker-201 机器

[root@docker-201 /tmp]#docker load <  0224-vim-net-tools-nginx-centos7.tar 
606d67d8e1b8: Loading layer [==================================================>]  204.7MB/204.7MB
857528fc25fb: Loading layer [==================================================>]  311.1MB/311.1MB
Loaded image: yuchao163/0224-vim-net-tools-nginx-centos7:latest
[root@docker-201 /tmp]#docker images
REPOSITORY                                   TAG       IMAGE ID       CREATED        SIZE
yuchao163/0224-vim-net-tools-nginx-centos7   latest    3a152c4459a1   9 hours ago    504MB
busybox                                      latest    beae173ccac6   8 months ago   1.24MB
[root@docker-201 /tmp]#

4.=========================
然后再发给其他机器运行多次  
- 测试环境docker-200 ，发给 生产环境 docker-201 
- 访问 10.0.0.201:17799 看到 day day up

[root@docker-201 /tmp]#docker run -d -p 17799:80 yuchao163/0224-vim-net-tools-nginx-centos7 nginx -g "daemon off;"
f5b3bfe7f0125bb738eb519d88cc0971442acf575769b73310b66db00f27c007
[root@docker-201 /tmp]#



5.查看容器日志，进入容器内查看nginx日志

[root@docker-201 /tmp]#docker exec -it  f5b  bash
[root@f5b3bfe7f012 /]# 
[root@f5b3bfe7f012 /]# 

[root@f5b3bfe7f012 /]# tail -f /var/log/nginx/access.log 

小结，
1。再docker-200机器，自定义构建的 nginx镜像，再200机器上的运行玩法
2.以及 将docker-200的本地镜像，docker save 导出，发给 docker-201，且docker load 导入
以及再docker-201 机器，也运行了 nginx的页面，
3. 进入容器内，查看容器内程序的运行日志

完全看懂。33333



========================================================================

基于docker hub 公开仓库的，镜像远程下载，使用

1. docker-200机器，推送
docker login

[root@docker-200 ~]#docker push yuchao163/0224-vim-net-tools-nginx-centos7
Using default tag: latest
The push refers to repository [docker.io/yuchao163/0224-vim-net-tools-nginx-centos7]
857528fc25fb: Pushed 
606d67d8e1b8: Mounted from library/centos 
latest: digest: sha256:3104cde6ae564ac5421721f8eda3703c66f88250850abc89d64e8b5a1a4df280 size: 742
[root@docker-200 ~]#





2. docker-201机器，下载，使用，运行容器实例。
docker pull yuchao163/0224-vim-net-tools-nginx-centos7:latest
最后一步
运行生产环境的 docker-201机器，nginx
80:80

[root@docker-201 /tmp]#curl 10.0.0.201
good good study 
day day up
[root@docker-201 /tmp]#


=================================







3.基于这个镜像，快速生成N个，nginx环境，提供vim  ,ifconfig  ,netstat 

[root@docker-200 ~]## 刚才 ，docker  run 进入的 6787xxx 容器内，以及做了一系列的梗概，  docker  commit 提交这个修改后的容器，为新的镜像，看懂1111
[root@docker-200 ~]#

================================================


4. 这个镜像，然后就可以，推送到镜像仓库，提供下载。离线导出，发给局域网的其他机器使用。



具体部署操作
1. 基础环境有了

2. 更新yum源
# 为什么不建议去yum install wget 
# 而是选择curl 
# ====为了精简化=======，docker镜像体积，去掉任何无用的操作===== ，1111111

# 清空原有yum环境
rm -f /etc/yum.repos.d/*

# vim  net-tools
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
# nginx 
curl  -o  /etc/yum.repos.d/epel.repo https://mirrors.aliyun.com/repo/epel-7.repo

# 需要生成缓存吗？不用？为什么？
yum install vim net-tools nginx -y 

# 最后清空缓存，降低容器内资源的占用，最终这个容器会被提交为镜像文件，镜像文件是有体积的
yum clean all

#  完全看懂2222




# 继续部署，自定义的容器空间内容





====================================================================================

#############################
1.此时再容器内使用该 工具包了




2.  推送这个本地镜像到 docker 仓库中，提供下载 


https://hub.docker.com/
注册账密，即可登录

2.1 本地docker 登录 docker hub
[root@docker-200 ~]#docker login 
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: yuchao163
Password: 
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded

# 



2.2 推送本地镜像到 docker hub
得将镜像名，改为以 docker hub 账号开头的规则

# docker 入门镜像 hello-world

docker run hello-world  # 2个作用 1，下载镜像 2. 创建容器空间，执行镜像内容
[root@docker-200 ~]#docker tag  hello-world:latest   yuchao163/0224-hello-docker

[root@docker-200 ~]#docker push yuchao163/0224-hello-docker
Using default tag: latest
The push refers to repository [docker.io/yuchao163/0224-hello-docker]
e07ee1baac5f: Mounted from library/hello-world 
latest: digest: sha256:f54a58bc1aac5ea1a25d796ae155dc228b3f0e11d046ae276b39c4bf2f13d8c4 size: 525
[root@docker-200 ~]#


# 推送本地镜像到，docker hub自己的账号仓库，看懂1111

# 能不能下载？
# 先删除本地镜像
[root@docker-200 ~]#docker rmi feb5d9fea6a5
Untagged: yuchao163/0224-hello-docker:latest
Untagged: yuchao163/0224-hello-docker@sha256:f54a58bc1aac5ea1a25d796ae155dc228b3f0e11d046ae276b39c4bf2f13d8c4
Deleted: sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412
Deleted: sha256:e07ee1baac5fae6a26f30cabfe54a36d3402f96afda318fe0a96cec4ca393359
[root@docker-200 ~]## 看懂先删除  和镜像依赖的容器记录，才能删除镜像，刷777
[root@docker-200 ~]#
[root@docker-200 ~]#

# 然后再下载docker hub的镜像
docker pull yuchao163/0224-hello-docker:latest
# 再次运行dockerhub，私有账号下的镜像
[root@docker-200 ~]#docker run yuchao163/0224-hello-docker


# 看懂dockerhub 公开仓库玩法，刷111




docker tag   镜像名    yuchao163/vim-net-tools-nginx-centos7

docker  push  


3.   离线导出这个镜像，发给局域网机器





====================================
步骤开始（等于你下一步要写 dockerfile，构建镜像脚本）
1. 基础镜像 centos7.4.1708
2. 部署步骤






```







## 容器内没有前台运行的进程，会立即挂掉

![1661843953114](pic/1661843953114.png)







## 停止容器，记录

```
[root@docker-200 /opt]#docker stop  modest_solomon
modest_solomon

重启

[root@docker-200 /opt]#docker start modest_solomon
modest_solomon
[root@docker-200 /opt]#




```





## 删除容器，记录

```
停止且删除某个容器记录
[root@docker-200 /opt]#docker stop php_nginx 
php_nginx

该容器只是挂掉了
[root@docker-200 /opt]#docker ps -a   |grep php_nginx
27d19b67fe6f   nginx:latest   "/docker-entrypoint.…"   3 hours ago   Exited (0) 16 seconds ago                                             php_nginx
[root@docker-200 /opt]#


彻底释放这个容器记录的资源，
docker rm php_nginx

```



## 批量停止运行中的容器（危险命令，慎用）

```
查询容器，且只显示id号
# 查询所有运行中的容器id号
[root@docker-200 /opt]#docker ps -q


# 查询所有，以及挂掉的容器，id号
[root@docker-200 /opt]#docker ps -aq


# 批量停止运行中的容器

[root@docker-200 /opt]#docker stop  $(docker ps -q)



```



## 批量删除挂掉的容器记录（慎用）

```
docker rm  删除容器记录
docker ps -aq  查询所有，容器得记录，提取id号。


[root@docker-200 /opt]#docker rm `docker ps -aq`


# 此时什么也没了
[root@docker-200 /opt]#docker ps -aq
[root@docker-200 /opt]#


```





## 运行镜像，生成容器（mysql容器）

```

```







# 3.一张图玩懂docker操作





# 4.docker镜像详解

一个完成的Docker镜像可以支撑容器的运行，镜像提供文件系统

```

```



## 内核与发行版

传统的虚拟机安装操作系统所提供的系统镜像，包含两部分：

Linux内核部分

```

```

而docker镜像是不包含内核的，只是下载了某个发行版部分。

```

```





## docker镜像定义（如何生成的镜像）



我们如果自定义镜像，刚才超哥已经和大家说了，docker镜像不包含linux内核，和宿主机共用。

我们如果想要定义一个mysql5.6镜像，我们会这么做

- 获取基础镜像，选择一个发行版平台（ubutu，centos）
- 在centos镜像中安装mysql5.6软件

导出镜像，可以命名为mysql:5.6镜像文件。

从这个过程，我们可以感觉出这是一层一层的添加的，docker镜像的层级概念就出来了，底层是centos镜像，上层是mysql镜像，centos镜像层属于父镜像。





### 为什么要有docker镜像

其实就是将业务代码运行的环境，整体打包为单个的文件，就是docker镜像。

### 如何创建docker镜像

现在docker官方共有仓库里面有大量的镜像，所以最基础的镜像，我们可以在公有仓库直接拉取，因为这些镜像都是原厂维护，可以得到即使的更新和修护。

### dockerfile

我们如果想去定制这些镜像，我们可以去编写Dockerfile，然后重新bulid，最后把它打包成一个镜像

这种方式是最为推荐的方式包括我们以后去企业当中去实践应用的时候也是推荐这种方式。



### docker commit

当然还有另外一种方式，就是通过镜像启动一个容器，然后进行操作，最终通过commit这个命令commit一个镜像。



## docker镜像分层结构

```
可以基于 docker history 查看镜像每一层信息
[root@docker-01 ~]#docker history nginx:1.17.9 
```







## base镜像

base镜像是指如各种Linux发行版，如centos，ubuntu，Debian，alpine等。





## docker为什么分层镜像

```
例如在后面的docker优化篇有一个多阶段构建镜像

镜像1 ，centos7.9 基础镜像，我们可以在这里做环境基础配置，如yum源，防火墙，主机名，dns设置等

镜像2，以这个为基础，再构建如nginx环境，然后提交，这就是一个独立的nginx+centos的镜像。


镜像3，例如再多阶段，构建一个php-fpm镜像，以镜像2为base image，这样我们就构建了一个centos+nginx+php的镜像，并且这仨，只用同一份基础镜像，每个阶段只是额外加了一层而已。

镜像4 ，该优化手段，可以实现，任意的组合，每个阶段的镜像，都可以搭配其他环境使用，作为base image，或者叫父镜像。


因此docker镜像这种镜像分为一层一层的概念，实现的技术名字叫做 联合文件系统UnionFS。

```



镜像分享一大好处就是共享资源，例如有多个镜像都来自于同一个base镜像，那么在docker 主机只需要存储一份base镜像。

内存里也只需要加载一份base镜像，即可为多个容器服务。

> 即使多个容器共享一个base镜像，某个容器修改了base镜像的内容，例如修改/etc/下配置文件，其他容器的/etc/下内容是不会被修改的，修改动作只限制在单个容器内，这就是容器的写入时复制特性（Copy-on-write）。





# 5.docker镜像实践操作

## 镜像详细命令

```
1.获取镜像，docker hub里有大量高质量的镜像

2.查看所有镜像

3.docker本地镜像存储在宿主机的目录查看

# 基于docker info 查看 docker数据目录
docker info 


4.# 以基础镜像运行一个容器，添加参数
-i  Keep STDIN open even if not attached
-t  Allocate a pseudo-TTY 
--rm  Automatically remove the container when it exits
--name   Assign a name to the container
bash 指定容器运行什么



```



## 镜像增删改查管理



### none镜像

none镜像（dangline image 虚悬镜像）

出现none镜像的原因：

- 在docker hub上镜像如果更新后，名称变化，用户再docker pull就会出现该情况
- docker build时候，镜像名重复，也会导致新旧镜像同名，旧镜像名称被取消，出现none

```
1. 一般用docker tag解决即可
2. 或者提取docker id 删除none镜像
```





### 列出镜像

```
1.根据名字列出镜像

2.查看指定镜像

3.只查看镜像id，id就代表该镜像了

4.格式化输出docker信息

5.更丰富的格式化
[root@docker-01 ~]#docker images --format "table {{.ID}} {{.Repository}} {{.Tag}}"

6.格式化是docker信息提取的高级语法，需要学习下go的template语法
# 基于--format="{{json .}}" 拿到详细字段，即可格式化

[root@docker-01 ~]#docker images --format="{{json .}}"

[root@docker-01 ~]#docker images --format="{{.CreatedAt}} {{.ID}}  {{.Repository}} {{.Size}} {{.Tag}}" |column -t


```







### 删除本地镜像

```
# 删除镜像，可以用 ID，名字

# 删除镜像，要先干掉使用该镜像的容器（无论是否存活）


# 不加tag版本的话，默认latest


# 清理挂掉的容器实例记录


# 根据id删除（最短3位）


# 清理所有镜像（危险命令）
# 删除命令，包括了删除，以及取消tag两个步骤



# 提示，不要随便用 docker rmi -f 强制参数



```





### 导出、导入镜像

常用于公司的离线环境使用镜像

默认导出的是tar归档文件

```
导出镜像

导入镜像
# 环境清理

# 导入本地镜像


```



### 查看镜像详细信息

```
[root@docker-01 /images_save_all]#docker inspect nginx:1.17.9  | jq 

# 查看无论是镜像，还是容器的详细信息，都是维护容器的重要手段
```



# 6.docker容器管理实践

## 启动容器

`docker run`等于创建+启动

**注意：容器内的进程必须处于前台运行状态，否则容器就会直接退出**

我们运行如centos基础镜像，没有运行任何程序，因此容器直接挂掉

```
# 交互式的运行，可以进入容器空间


# 非交互式运行，容器会直接挂掉（一般用于测试让容器执行某个命令，或者将某个镜像当做一个调试环境，执行xxx命令）

# 查看容器历史记录


```





## 运行可以活着的容器

```
-d 对于宿主机，后台运行容器
-p 端口映射

# 直接访问宿主机即可

# 宿主机上访问容器ip也可以

# 提取容器ip

# 访问容器


# 运行容器且指定名字
```



## 停止容器（并非删除）

```

```



## 监控容器资源状态

```

```







## 进入容器空间

```

```



## 访问容器应用(redis)

由于我们做了端口映射，可以基于宿主机的端口访问



```

```



## 查看容器内日志

```

```







## 删除容器

```

```



## 查看容器记录（挂掉，运行中）

```

```



## 批量干掉容器进程

-q 只显示id

-a 显示所有记录



````
1. 下载mysql5.7.38镜像，确保可以远程访问，创建库表
2. 下载redis最新镜像，确保可以远程访问，读写key
3. 下载nginx 1.21.5 ，确保可以远程访问，修改首页内容为，"云原生！我来了！"
4. 下载wordpress最新镜像，运行，确保可以访问，发表文章。
````

