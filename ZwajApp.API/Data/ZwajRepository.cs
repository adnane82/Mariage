using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Models;
using System.Linq;

namespace ZwajApp.API.Data
{
    public class ZwajRepository : IZwajRepository
    {
        private readonly DataContext _context;

        public ZwajRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
             _context.Remove(entity);
        }

        public async  Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.IgnoreQueryFilters().FirstOrDefaultAsync(p=>p.Id==id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user= await _context.Users.Include(U=>U.Photos).FirstOrDefaultAsync(U=>U.Id==id);
            return user;
        }

        public async  Task<IEnumerable<User>> GetUsers()
        {
            var users =await _context.Users.Include(U=>U.Photos).ToListAsync();
            return users;
        }

        public async  Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync()>0;
        }
        public async Task<Photo> GetMainPhotoForUser(int userId){
  
              return  await _context.Photos.Where(U=>U.UserId==userId).FirstOrDefaultAsync(p=>p.IsMain);
        }
    }
}