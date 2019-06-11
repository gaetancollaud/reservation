# reservation
This application was generated using JHipster 5.6.1, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v5.6.1](https://www.jhipster.tech/documentation-archive/v5.6.1).

## Build docker image

```
./mvnw package -DskipTests -Pprod verify jib:dockerBuild
docker tag reservation gaetancollaud/reservation
docker push gaetancollaud/reservation
```
