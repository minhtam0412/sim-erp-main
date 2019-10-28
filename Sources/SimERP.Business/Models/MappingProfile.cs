using AutoMapper;
using SimERP.Data.DBEntities;
using Product = SimERP.Business.Models.MasterData.ListDTO.Product;
using Vendor = SimERP.Business.Models.MasterData.ListDTO.Vendor;

namespace SimERP.Business.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<Data.DBEntities.Product, Product>();
            CreateMap<Data.DBEntities.Vendor, Vendor>();
        }
    }
}
