
// 新增的磁盘/dev/vde可以直接加到vg中，然后直接扩容到lv中
vgextend datavg01 /dev/vde
lvextend -l 100%free /dev/datavg01/lv01
// xfs 刷新格式
xfs_growfs /dev/datavg01/lv01
// 如果是ext4,就是用resize2fs
resize2fs  /dev/datavg01/lv01 

// 新创建lvs的时候需要可视化，使用mk2fs ； 如果是lv已经存在，只需要刷新格式即可（xfs_growfs或者resize2fs)
 lvcreate -l +100%free -n lv01 datavg01
 mk2fs -t ext4 /dev/mapper/datavg01-lv01
 
 // 扩容vg中空余的空间指定部分空间扩容到对应的lv中，用-L 参数， 全部空间用-l  100%free
lvextend -L +200G /dev/datavg01/lv01 
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
