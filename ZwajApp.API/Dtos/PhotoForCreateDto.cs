using System;
using Microsoft.AspNetCore.Http;

namespace ZwajApp.API.Dtos
{
    public class PhotoForCreateDto
    {
        
        public string Url { get; set; }

         public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
         public string PublicId { get; set; }
        public PhotoForCreateDto()
        {
            this.DateAdded=DateTime.Now;
        }
    }
}