<%@ page language="java" contentType="text/html; charset=UTF-8"
 pageEncoding="UTF-8" isELIgnored="false"%>
 
<div style="margin:0px auto; width:500px">
 
<form action="save" method="post"> 
    <table>    
        <tr>
            <td>OIO CPNo</td>
            <td><input name="CPNO"></td>
        </tr>
        <tr>
            <td>契約Seq</td>
            <td><input name="SEQNO"></td>
        </tr>
        <tr>
            <td>契約期間</td>
            <td><input name="CONT_TERM"></td>
        </tr>
		 <tr>
            <td>契約開始日</td>
            <td><input name="CONT_START"></td>
        </tr>
         <tr>
            <td>終了日</td>
            <td><input name="CONT_END"></td>
        </tr>
         <tr>
            <td>終了日</td>
            <td><input name="CONT_END"></td>
        </tr>
         
		 <tr>
            <td>作成日時</td>
            <td><input name="CREATE_TIMESTAMP"></td>
        </tr>
		<tr>
            <td>最終更新日時</td>
            <td><input name="UPDATE_TIMESTAMP"></td>
        </tr>
		<tr>
            <td>作成者</td>
            <td><input name="CREATE_USER"></td>
        </tr>
        <tr>
            <td>最終更新者</td>
            <td><input name="UPDATE_USER"></td>
        </tr>
        <tr>
            <td>
              <button type="submit" style= "color:#000000;background-color:#F08080">SUBMIT</button>
            </td>
        </tr>
    </table>
</form>
</div>