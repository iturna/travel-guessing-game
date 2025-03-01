FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# Copy the project file and restore dependencies
COPY globetrotter-api/*.csproj ./
RUN dotnet restore

# Copy the rest of the code
COPY globetrotter-api/ ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/out .
COPY --from=build /app/Data/Resources ./Data/Resources

# Set environment variables
ENV ASPNETCORE_URLS=http://+:$PORT

ENTRYPOINT ["dotnet", "globetrotter-api.dll"]