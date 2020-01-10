using System.ComponentModel.DataAnnotations;

namespace ZwajApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }
          [Required]
        [StringLength(8,MinimumLength=4,ErrorMessage="Votre mot de passe n'est pas correcte")]
        public string Password { get; set; }

    }
}