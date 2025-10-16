using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOS;

public class RegisterDto
{
    [Required]
    public string Email { get; set; } = string.Empty; //預設為空字串
    public required string Password { get; set; }
}
