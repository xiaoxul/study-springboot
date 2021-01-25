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
     <td> 
      <font size="5" color="#DC143C">SMTP发送成功！！！</font> 
     </td> 
     <br/> 
     <form action="send" method="post">  
     <table>         
         <tr> 
             <td>SENDER EMAIL：</td> 
             <td><input name="senderemail"></td> 
         </tr> 
         <tr> 
             <td>SENDER PASSWORD：</td> 
             <td><input name="senderpassword"></td> 
         </tr> 
         <tr> 
             <td>RECIPIENT EMAIL：</td> 
             <td><input name="recipientemail"></td> 
         </tr> 
          <tr> 
             <td>SUBJECT：</td> 
             <td><input name="subject"></td> 
         </tr> 
          <tr> 
             <td>CONTENT：</td> 
             <td><input name="content"></td> 
         </tr> 
         <tr> 
             <td> 
               <button type="submit" style= "color:#000000;background-color:#F08080">SUBMIT</button> 
             </td> 
         </tr> 
     </table> 
 </form> 
 

      
 

 </div> 
