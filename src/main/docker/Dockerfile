FROM java:8
MAINTAINER  <xiaoxul@cn.ibm.com>
EXPOSE 8081
VOLUME /tmp
ADD Oiobamademo-0.0.1-SNAPSHOT.jar oioapp.jar
RUN sh -c 'touch /oioapp.jar'
ENV JAVA_OPTS=""
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /oioapp.jar" ]
