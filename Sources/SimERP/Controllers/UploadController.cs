using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Newtonsoft.Json;
using SimERP.Business;
using SimERP.Data.DBEntities;
using Product = SimERP.Business.Models.MasterData.ListDTO.Product;
using AttachFile = SimERP.Business.Models.MasterData.ListDTO.AttachFile;

namespace SimERP.Controllers
{
    [ApiController] 
    public class UploadController : BaseController
    {
        public UploadController(IHttpContextAccessor httpContextAccessor, IMapper mapper) : base(httpContextAccessor, mapper)
        {
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("api/uploadproductfile")]
        public async System.Threading.Tasks.Task<IActionResult> UploadProductFileAsync()
        {
            List<string> lstPath = new List<string>();
            try
            {
                var files = Request.Form.Files;
                if (Request.HasFormContentType)
                {
                    if (Request.Form.ContainsKey("data"))
                    {
                        IFormCollection form;
                        form = await Request.ReadFormAsync(); // async
                        string param1 = form["data"];
                        var data = JsonConvert.DeserializeObject<Product>(param1);
                    }
                }

                var folderName = Path.Combine("Upload", "Product");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }

                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim().ToString();
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    lstPath.Add(dbPath);
                }

                return Ok(lstPath);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [NonAction]
        public async Task<ResponeResult> UploadFile(IFormFileCollection Files, string pathToUpload)
        {
            var repData = new ResponeResult();
            Dictionary<string, AttachFile> mapFile = new Dictionary<string, AttachFile>();
            try
            {
                if (Files != null && Files.Any())
                {
                    var files = Files;
                    var folderName = Path.Combine("Upload", pathToUpload);
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                    if (files.Any(f => f.Length == 0))
                    {
                        repData.IsOk = false;
                        repData.MessageText = "Thông tin tập tin upload không hợp lệ!";
                        return repData;
                    }

                    foreach (var file in files)
                    {
                        var FileNameOriginal = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim().ToString();
                        var fileNameEncrypt =  Guid.NewGuid() + Path.GetExtension(FileNameOriginal);
                        var fullPath = Path.Combine(pathToSave, fileNameEncrypt);
                        var dbPath = Path.Combine(folderName, fileNameEncrypt);

                        AttachFile attachFile = new AttachFile();
                        attachFile.FileNameOriginal = FileNameOriginal;
                        attachFile.FilePath = dbPath;
                        attachFile.FileName = fileNameEncrypt;

                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                        mapFile.Add(file.Name, attachFile);
                    }

                    repData.IsOk = true;
                    repData.RepData = mapFile;
                }

            }
            catch (Exception ex)
            {
                repData.IsOk = false;
                repData.MessageText = "Internal server error";
                repData.MessageError = ex.Message;
            }
            return repData;
        }
    }
}