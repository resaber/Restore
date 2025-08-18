using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseAPIController
{
    [HttpGet("not-found")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }


    [HttpGet("bad-request")]
    public ActionResult GetBadRequest()
    {
        return BadRequest("資料回應錯誤");
    }


    [HttpGet("unauthorized")]
    public IActionResult GetUnAuthorized()
    {
        return Unauthorized();
    }

    [HttpGet("validation-error")]
    public IActionResult GetValidationError()
    {
        ModelState.AddModelError("問題1", "第一個錯誤");
        ModelState.AddModelError("問題2", "第二個錯誤");
        //return status code 400 但回應的是list 不同的validation errors
        return ValidationProblem("錯誤的請求，錯誤的驗證內容");
    }

    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("伺服器錯誤");
    }
}