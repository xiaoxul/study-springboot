FROM ibmjava
MAINTAINER  <xiaoxul@cn.ibm.com>
EXPOSE 8081

ADD Oiobamademo-0.0.1-SNAPSHOT.jar oioapp.jar
ENTRYPOINT [ "java", "-jar", "oioapp.jar" ]
