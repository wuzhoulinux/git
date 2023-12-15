
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
