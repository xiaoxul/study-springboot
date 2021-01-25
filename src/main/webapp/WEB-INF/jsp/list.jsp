<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
   
<div align="center">
 
</div>

<div style="width:500px;margin:20px auto;text-align: center">
<style>
a:link {color: #DC143C} /* 未访问的链接 */
a:visited {color: #CD5C5C} /* 已访问的链接 */
a:hover {color: #FFA500} /* 鼠标移动到链接上 */
a:active {color: #FFC0CB} /* 选定的链接 */
</style>
    <table align='center' border='1' cellspacing='2'>
    
        <tr>
            <td>NUMBER</td>
            <td>NAME</td>
            <td>AGE</td>
            <td>SEX</td>
            <td>UPDATE</td>
            <td>DELETE</td>
        </tr>
        <c:forEach var="studentEntity" items="${studentEntityList}">
            <tr>
                <td>${studentEntity._id}<c:out value="${studentEntity._id}" /></td>
                <td>${studentEntity.name}</td>
                <td>${studentEntity.age}</td>
                <td>${studentEntity.sex}</td>
                <td><a href="update?id=${studentEntity._id}">UPDATE</a></td>
                <td><a href="delete?id=${studentEntity._id}">DELETE</a></td>
            </tr>
        </c:forEach>
         
    </table>
    <a href='./student'>ADD</a><br/>
    <a href='./env'>ENV</a><br/>
    <a href='./tosend'>Send Mail</a>

</div>