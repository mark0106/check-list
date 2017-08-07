using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using CheckListManager.Models;
using System.Data.Entity.Validation;

namespace CheckListManager.Controllers
{
    public class CheckListController : ApiController
    {
        private CheckListEntities db = new CheckListEntities();
        // GET: CheckList
        [HttpGet]
        public async Task<IHttpActionResult> GetListItems(int id)
        {
            
            var typesList = await db.CheckListItems
                .Where(x => x.CheckListId == id) 
                .Select(x => new
                {
                    Id = x.Id,
                    CheckListId = x.CheckListId,
                    Description = x.Description,
                    IsComplete = x.IsComplete,
                })
                .ToListAsync();

            if (typesList == null)
            {
                return NotFound();
            }

            var modifiedList = (from cl in typesList.AsEnumerable()
                                select new
                                {
                                   Title = db.CheckListItems.Where(x => x.CheckList.Id == cl.CheckListId).Select(x => x.CheckList.Name).FirstOrDefault(),
                                   Id = cl.Id,
                                   CheckListId = cl.CheckListId,
                                   Description = cl.Description,
                                   IsComplete = cl.IsComplete,
                                });

            return Ok(modifiedList);

        }

        [HttpGet]
        public async Task<IHttpActionResult> GetMyLists(int id)
        {

            var typesList = await db.CheckLists
                .Where(x => x.LoginId == id && x.IsActive == true)
                .Select(x => new
                {
                    Id = x.Id,
                    Name = x.Name,
                    
                })
                .ToListAsync();

            if (typesList == null)
            {
                return NotFound();
            }

            var modifiedList = (from mcl in typesList.AsEnumerable()
                                select new
                                {
                                    Id = mcl.Id,
                                    Name = mcl.Name

                                });

            return Ok(modifiedList);

        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveCheckList(CheckList cl)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                CheckListItem cli = new CheckListItem();
                var checkListCount = db.CheckLists.Where(x => x.Id == cl.Id).Count();
                if (checkListCount > 0)
                {
                    //Create first empty list item
                    cli.CheckListId = cl.Id;
                    cli.CreateDate = DateTime.Now;
                    cli.IsComplete = false;
                    db.CheckListItems.Add(cli);
                    await db.SaveChangesAsync();
                } else
                {
                    //Creating new check list 
                    cl.IsActive = true;
                    cl.CreateDate = DateTime.Now;
                    db.CheckLists.Add(cl);
                    await db.SaveChangesAsync();

                    //Create first empty list item
                    cli.CheckListId = cl.Id;
                    cli.CreateDate = DateTime.Now;
                    cli.IsComplete = false;
                    db.CheckListItems.Add(cli);
                    await db.SaveChangesAsync();
                }
                   
                


                //CheckListItem nCheckListItem = await db.CheckListItems.Where(x => x.Id == cli.Id).FirstOrDefaultAsync();

                return Ok(cli);
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveCheckListItem(CheckListItem cli)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
               
                var cItem = await db.CheckListItems.Where(x => x.Id == cli.Id).FirstOrDefaultAsync();
                
                if (cItem != null)
                {
                    cItem.Description = cli.Description;
                    cItem.IsComplete = cli.IsComplete;
                   
                    await db.SaveChangesAsync();

                    return Ok(cli);

                }
                else
                {
                    return NotFound();
                }
               
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IHttpActionResult> DeleteCheckList(CheckList cl)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                var checkList = await db.CheckLists.Where(x => x.Id == cl.Id).FirstOrDefaultAsync();

                if (checkList != null)
                {
                    checkList.IsActive = false;
                    await db.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    return NotFound();
                }

            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}