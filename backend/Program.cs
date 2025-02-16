using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using static Microsoft.AspNetCore.Http.StatusCodes;
using qrmanagement.backend.Context;
using qrmanagement.backend.Repositories;
var builder = WebApplication.CreateBuilder(args);

// builder.WebHost.UseKestrel(options =>
// {
//     options.ListenAnyIP(5199); // HTTP
//     options.ListenAnyIP(7103, listenOptions =>
//     {
//         listenOptions.UseHttps(); // HTTPS
//     });
// });

builder.Services.AddCors(options => {
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
    );
});
var conString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDBContext>(options =>
    options.UseSqlServer(conString ?? throw new InvalidOperationException("Connection string 'Default Connection' not found."))
);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<IAssetRepository, AssetRepository>();


// Add logging services
builder.Logging.ClearProviders(); // Clear default providers
builder.Logging.AddConsole(); // Add console logging
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Debug); // Set the minimum log level

var app = builder.Build();
app.Logger.LogInformation("Adding Routes");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");
app.UseRouting();
app.MapControllers();
app.UseHttpsRedirection();
app.Run();
