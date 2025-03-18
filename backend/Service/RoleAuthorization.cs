

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace qrmanagement.backend.Services
{
    public class RoleAuthorization : Attribute, IAuthorizationFilter
    {
        private readonly string _requiredSubrole;

        public RoleAuthorization(string requiredSubrole)
        {
            _requiredSubrole = requiredSubrole;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (!user.Identity!.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userSubRole = user.FindFirst("subRole")?.Value;
            if (userSubRole == null || userSubRole != _requiredSubrole)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}