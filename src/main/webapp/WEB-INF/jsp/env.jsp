<%@ page language="java" contentType="text/html; charset=UTF-8"

 pageEncoding="UTF-8" isELIgnored="false"%>

 

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

 

<form modelAttribute = "studentEntity"> 

   <table align='center' border='1' cellspacing='2'>   

        <tr>

            <td>USER：</td>

            <td><input name="user" value="${studentEntity.user}" ></td>

        </tr>

         <tr>

            <td>PASS：</td>

            <td><input name="pass" value="${studentEntity.pass}" ></td>

        </tr>

    </table>

</form>

    <a href='./student'>ADD</a><br/>

    <a href='./list'>LIST</a><br/>

    <a href='./tosend'>Send Mail</a>

    



</div>