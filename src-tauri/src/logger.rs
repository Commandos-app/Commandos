use log::{debug, error, info, trace, warn, LevelFilter};
use log4rs::{
  append::rolling_file::{
    policy::compound::{
      roll::fixed_window::FixedWindowRoller, trigger::size::SizeTrigger, CompoundPolicy,
    },
    RollingFileAppender,
  },
  config::{Appender, Config, Root},
  encode::pattern::PatternEncoder,
  filter::threshold::ThresholdFilter,
};
use serde_repr::Deserialize_repr;

#[derive(Deserialize_repr, Debug)]
#[repr(u16)]
pub enum LogLevel {
  Trace = 1,
  Debug,
  Info,
  Warn,
  Error,
}

pub fn init_log() {
  let window_size = 3; // log0, log1, log2
  let fixed_window_roller = FixedWindowRoller::builder()
    .build("log/log_{}.log", window_size)
    .unwrap();

  let size_limit = 10 * 1024 /* * 1024*/; // 10MB as max log file size to roll
  let size_trigger = SizeTrigger::new(size_limit);

  let compound_policy = CompoundPolicy::new(Box::new(size_trigger), Box::new(fixed_window_roller));

  let file = RollingFileAppender::builder()
    .encoder(Box::new(PatternEncoder::new(
      "[{d(%Y-%m-%d %H:%M:%S)}][{l}] {m}{n}",
    )))
    .build("log/logs.log", Box::new(compound_policy))
    .unwrap();

  let config = Config::builder()
    .appender(
      Appender::builder()
        .filter(Box::new(ThresholdFilter::new(LevelFilter::Info)))
        .build("file", Box::new(file)),
    )
    .build(Root::builder().appender("file").build(LevelFilter::Trace))
    .unwrap();

  let _ = log4rs::init_config(config).unwrap();
}

#[tauri::command]
pub fn logging(message: String, level: LogLevel) {
  match level {
    LogLevel::Trace => trace!("{}", message),
    LogLevel::Debug => debug!("{}", message),
    LogLevel::Info => info!("{}", message),
    LogLevel::Warn => warn!("{}", message),
    LogLevel::Error => error!("{}", message),
  }
}
