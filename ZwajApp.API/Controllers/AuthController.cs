using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _mapper = mapper;
            _config = config;
            _repo = repo;

        }

        [HttpPost("register")]

        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {

            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            if (await _repo.UserExists(userForRegisterDto.Username))
                return BadRequest("Cette utilisateur existe déjà");
            var UserToCreate = _mapper.Map<User>(userForRegisterDto);
            
            var CreatedUser = await _repo.Register(UserToCreate, userForRegisterDto.Password);
            var userToReturn = _mapper.Map<UserForDetailsDto>(CreatedUser);
            return CreatedAtRoute("GetUser",new {Controller="Users", id=CreatedUser.Id},
            userToReturn
            );
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {


            var userFromRepo = await _repo.Login(userForLoginDto.username.ToLower(), userForLoginDto.password);
            if (userFromRepo == null) return Unauthorized();
            var claims = new[] {
                     new Claim (ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                     new Claim(ClaimTypes.Name,userFromRepo.Username)

             };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var tokenDescriptor = new SecurityTokenDescriptor
            {

                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var user = _mapper.Map<UserForListDto>(userFromRepo);
            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                user
            });




        }







    }
}