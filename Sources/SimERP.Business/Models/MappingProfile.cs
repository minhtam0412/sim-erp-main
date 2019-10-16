using AutoMapper;
using SimERP.Data.DBEntities;
using Product = SimERP.Business.Models.MasterData.ListDTO.Product;

namespace SimERP.Business.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<Data.DBEntities.Product, Product>();
        }
    }
}
