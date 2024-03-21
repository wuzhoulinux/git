文件权限备份
[root@node102 ~]# getfacl  -pR /opt > 1.bak   //备份opt目录下的所有文件权限，-p  绝对路径， -R 递归；  如果不加-p 就是相对路径
[root@node102 ~]# head 1.bak
# file: /opt
# owner: root
# group: root
user::rwx
group::r-x
other::r-x
# file: /opt/containerd
# owner: root
# group: root
[root@node102 ~]# ll -ld /opt
drwxr-xr-x. 6 root root 58 1月  18 15:24 /opt
[root@node102 ~]# chmod 000 /opt
[root@node102 ~]# ll -ld /opt
d---------. 6 root root 58 1月  18 15:24 /opt
[root@node102 ~]# setfacl --restor=1.bak    //还原备份权限
[root@node102 ~]# ll -ld /opt/
drwxr-xr-x. 6 root root 58 1月  18 15:24 /opt/

创建lvm过程 
物理卷pv--卷组vg--逻辑卷lv
创建物理卷
pvcreate  /dev/sdb
如果没有卷组，创建卷组；
vgcreate vg01 /dev/sdb
加入卷组，如果以及有卷组了，可以直接加入
vgextend vg01 /dev/sdb
创建逻辑卷
lvcreate  -L 100M lv01 vg01
格式化mkfs.xfs ，mkfs.ext4
mkfs.xfs /dev/sdb/lv01  //格式化xfs格式
已经有逻辑卷了，给逻辑卷扩容
lvextend -l 100%free /dev/sdb1/lv01
刷新格式
xfs_growfs /dev/sdb1/lv01   xfs格式
resize2fs  /dev/sdb1/lv01   ext4格式


// 新增的磁盘/dev/vde可以直接加到卷组vg中，然后直接扩容到lv中
vgextend vg01 /dev/vde
lvextend -l 100%free /dev/vg01/lv01
// xfs 刷新格式
xfs_growfs /dev/vg01/lv01
// 如果是ext4,就是用resize2fs
resize2fs  /dev/vg01/lv01 

// 新创建lvs的时候需要可视化，使用mk2fs ； 如果是lv已经存在，只需要刷新格式即可（xfs_growfs或者resize2fs)
 lvcreate -l +100%free -n lv01 vg01
 mk2fs -t ext4 /dev/mapper/vg01-lv01
 
 // 扩容vg中空余的空间指定部分空间扩容到对应的lv中，用-L 参数， 全部空间用-l  100%free
lvextend -L +200G /dev/vg01/lv01 
blkid //查看分区使用文件系统类型
//ext4用resize2fs
resize2fs /dev/datavg01/lv01


//测试磁盘的io写速度  dd if=/dev/zero of=test.dbf bs=8k count=3000000, 如果要测试实际速度，还需要在末尾加上oflag=direct测到的才是真实IO速度，
//if是源文件，of是目标文件，搞反了目标文件就覆盖了
dd if=/dev/zero of=test2021.txt bs=4k count=1000 oflag=direct
dd if=/dev/zero of=test2021.txt bs=8k count=1000 oflag=direct
dd if=/dev/zero of=test2021.txt bs=1M count=1000 oflag=direct
//测试磁盘的io读速度
dd if=test2021.txt of=/dev/null bs=8k count=1000
dd if=test2021.txt of=/dev/null bs=4k count=1000
dd if=test2021.txt of=/dev/null bs=1M count=1000

//关闭swap分区
swapoff -a
//打开swap分区
swapon -a

//版本之间升级主要看3大件版本
kernel， glibc， systemd

cat /etc/ansible/ansible.cfg
become=True
become_method=su
become_user=root

cat /etc/ansible/hosts
x.x.x.x  ansible_ssh_user=xxx  ansible_ssh_paas=xxx  ansible_become_paas=xxxx

//刷新文件系统（磁盘修复）
ext4
fsck -y /dev/文件系统路径
xfs
xfs_repair -L /dev/文件系统路径

//添加kubectl自动补齐
echo "source <(kubectl completion bash)" >> ~/.bashrc


//iperf3是一个TCP,UDP,SCTP网络带宽测量工具，，是用于主动测量IP网络上可达到的最大带宽工具， 支持调整与时序，协议和缓冲区有关的各种参数，对于每个测试，他都会报告测得吞吐量/比特率，损耗和其他阐述
iperf3 -c x.x.x.x  -i 1 -t 5 -p 5201


//openssh
https://cdn.openbsd.org/pub/OpenBSD/OpenSSH/portable/openssh-9.6p1.tar.gz

//ext4文件系统上删除文件，可以恢复: extundelete ，ext3恢复使用：ext3grep
windows恢复误删除的文件：  final data v2.0 汉化版  和  easyrecovery
参考链接：https://www.27ka.cn/362087.html
        https://blog.csdn.net/yaxuan88521/article/details/127890871

//单用户
//预挂载模式rd.break
rw rd.break 
chroot /sysroot    //如果直接rw init=/bin/bash,默认进的就是/sysroot
修改root密码  passwd  root
创建.autorelable 
touch /.autorelable

//释放cache
sync 同步内存数据到磁盘中
echo '3' > /proc/sys/vm/drop_caches 清理buff,cache（没被进程占用的部分）


//制作yum,2个方法
1.下载iso文件挂载
mount -t iso9660 xxx.iso  目录
2.如果没有iso文件,下载所有的rpm到目录中,建立索引
createrepo /rpm的目录
创建yum.repo
[自定义标签]
name=自定义
baseurl=file:///mnt/iso/xxx目录
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EulerOS
gpgcheck=1   //如果不校验设置0
enable=1    //设置0当前标签源不生效

//nfs挂载
mount -t nfs -o vers=3,nolock ip:/xxx  /挂载目录

//修改链路进出站规则
修改input链直接DROP
#iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP
保存规则
iptables-save >iptables.txt
还原规则
iptables-restore <iptables.txt
删除规则
1.根据第几条删除
iptables -nvL --line-number  //查看规则的序列
删除指定序列规则
iptables -D INPUT  1  // -D 删除指定序列链接下的规则
2.直接命令删除规则
iptables -D INPUT -j REJECT xxxxxx  //可以查看/etc/sysconfig/iptables中的规则, 将A或者i添加 改成-D 删除

//iptables规则转发
iptables -t nat -A PREROUTING -p tcp --dport 7777 -j REDIRECT --to-port 6666   //将本机的7777端口转发到6666端口
 -t 指定表
 -A 添加链路规则
 -p 指定IP协议 (tcp/udp)
 -d 目标IP
 -s 来源IP
 --dport 目标端口
  -j 跳转动作, 比如DROP,ACCEPT
 -j REDIRECT 目标跳转


//iptables转发, 
//可以本地端口转发到本地另外端口
//也可以将本地流量转发到其他主机上, 这个需要结合SNAT一起使用
//访问本机的2222端口转发到目标机器上的22端口 , 相当于登陆主机2222端口,其实是登陆了另外一台机器
iptables -t nat -A PREROUTING -p tcp -d 本机IP地址 --dport 本机端口 -j DNAT --to-destination 目标主机IP:端口
iptables -t nat -A POSTROUTING  -p tcp -d 目标主机IP --dport 目标端口 -j SNAT --to-source 本机IP地址 
这两条规则的原理是:
对于达到本机2222端口的数据包,再被路由转发之前更改目的地址,让它从网卡转发出去,而不是留在本地,此时,它的目的地址已经改了,但是源地址不是远程地址.
这个数据包随后达到POSTROUTING链,将其源地址改为本地IP地址(--to-source),发送给目标ip(-d 目标IP). 不然,原来是个远程地址,会导致服务器回应的包被发送到远程地址,而不是中专机
参考:https://www.cnblogs.com/wangbingbing/p/17055174.html
从上面的发展我们知道作者选择了5个位置来座位控制的地方,但是你有没有发现,其实前三个位置已经基本上将路径彻底封锁了,但是为什么已经再进出口的设置了关卡之后还要在内部卡呢? 
 由于数据包尚未进入路由决策,还不知道数据要走向哪里,所以在进出口是没办法实现数据过滤的. 所以要在内核空间里设置转发的关卡,进入用户空间的关卡,从用户空间出去的关卡. 
 那么,既然他们没什么用,那我们为什么还要设置他们呢? 因为我们在做NAT和DNAT的时候,目标地址转换必须在路由之前转换. 所以我们必须在外网而后内网的接口出进行设置关卡.
 这5个位置也被称为五个钩子函数,也叫5个规则链.
 1.PREROUTING (路由前)
 2.INPUT (数据包流入口)
 3.FORWARD (转发关卡)
 4.OUTPUT(数据包出口)
 5.POSTROUTINT(路由后)

//修改开机使用内核
# cat /boot/grub2/grub.cfg |grep menuentry //查看系统可用内核
# grub2-set-default '内核'  //设置启动使用内核
# grub2-edienv list //查看

//ps 排序线程中cpu使用率前五的java线程
for i in `ps -ef|grep java|grep -v grep |awk '{print $2}'`;do echo "java process is $i" >>xx.log ;echo -e "`ps -mp $i -o THREAD,tid,time|sort -rnk2|head -n 5`\n" >>xx.log;done

//查看java进程中的县城数有多少个
ps 查找线程数量最大的java线程
for i in `ps -ef|grep java|grep -v grep|awk '{print $2}'`;do echo "java process is $i,number of thread is `ps -mp $i -o THREAD,tid,time|wc -l`" >>yy.log;done


//yum 仅下载
# yumdownloader --downloadonly rpm包

