#!/usr/bin/env groovy

def injectConfigIntoEnv
injectConfigIntoEnv = {map, prefix = '' ->
  map.each { k, v ->
    def envKey = "${prefix.toUpperCase()}_${k.toUpperCase()}"

    switch(v){
      case String:
        env[envKey] = v
        break
      case java.util.Array:
        v.eachWithIndex{ v2, i -> env["${envKey}_${i}"] = v2 }
        break;
      default:
        injectConfigIntoEnv(v, envKey)
    }
  }
}


node {
  // load main config
  def json
  configFileProvider([configFile(fileId: 'main', variable: 'mainConfig')]) {
    def config = readFile(mainConfig)
    json = parseJson(config)
    
    injectConfigIntoEnv(json,json.env_prefix)
  }

  // load different stage configs
  json.configfiles.each {
    k, v ->
      configFileProvider([configFile(fileId: v, variable: "config")]) {
        def configFile = readFile(config)
        def configJson = parseJson(configFile)

        injectConfigIntoEnv(configJson, json.env_prefix+"_"+v.replace('-','_'))
      }
  }

  try {
    // Cleanup local checkout
    sh "rm -rf *"
    sh "rm -rf .git"

    checkout scm

    // Read meta info from package.json
    def packageFile = readFile('package.json')
    packageJson = parseJson(packageFile)

    env.MODULE_TYPE = packageJson.moduleType ?: 'npm'
    env.PROJECT_NAME = packageJson.name
    env.PROJECT_VERSION = packageJson.version
    /* TODO: if package.json's script property has certain properties needed for integration tests */

    def steps, pipeline
    fileLoader.withGit(env.VDMS_JENKINSFILE_REPOSITORY, env.VDMS_JENKINSFILE_BRANCH, env.VDMS_CREDENTIALS_GIT_PROVIDER, '') {
      steps = fileLoader.load(env.VDMS_STEPS_FILE)
      pipeline = fileLoader.load("${env.MODULE_TYPE}.groovy")

      stage 'Prepare'
      pipeline.prepare(steps)

      stage 'Compile'
      pipeline.compile(steps)

      stage 'Unit tests'
      pipeline.unitTests(steps)

      stage 'Integration test'
      pipeline.integrationTests(steps)

      stage 'Code Analysis'
      pipeline.codeAnalysis(steps)

      stage 'Dist Assembly'
      pipeline.assembleDist(steps)

      stage 'Publish Dist'
      pipeline.publishBinaries(steps)
    }
  }
  catch (any) {
    //send emails on failure
    step([
      $class: 'Mailer',
      notifyEveryUnstableBuild: true,
      recipients: '',
      sendToIndividuals: true
    ])

    throw any
  }
}